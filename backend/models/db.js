import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// -------------------------------------------------------------
// 1. Mongoose Schemas & Models (MongoDB Atlas)
// -------------------------------------------------------------
const formatDoc = {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : ret.id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
  },
  { toJSON: formatDoc, toObject: formatDoc }
);

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { toJSON: formatDoc, toObject: formatDoc }
);

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  { toJSON: formatDoc, toObject: formatDoc }
);

const quoteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    serviceRequired: { type: String, required: true, trim: true },
    budget: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { toJSON: formatDoc, toObject: formatDoc }
);

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, required: true, trim: true },
    dept: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Active', 'Away', 'Offline'], default: 'Active' },
    initials: { type: String },
    color: { type: String, default: '#7c4dff' },
    createdAt: { type: Date, default: Date.now },
  },
  { toJSON: formatDoc, toObject: formatDoc }
);

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export const ContactModel = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
export const NewsletterModel = mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);
export const QuoteModel = mongoose.models.Quote || mongoose.model('Quote', quoteSchema);
export const EmployeeModel = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

// -------------------------------------------------------------
// 2. Connection Handling with Graceful Fallback
// -------------------------------------------------------------
let isMongoConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.log('[Database] MongoDB Atlas URI not configured or contains placeholders.');
    console.log('[Database] Operating with persistent local collection store in backend/data/');
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log('[Database] Successfully connected to MongoDB Atlas!');
    return true;
  } catch (err) {
    console.warn(`[Database] MongoDB connection error (${err.message}). Using persistent local store in backend/data/`);
    isMongoConnected = false;
    return false;
  }
}

// -------------------------------------------------------------
// 3. Persistent Local Store Fallback Implementation
// -------------------------------------------------------------
class LocalCollection {
  constructor(collectionName, dateKey = 'createdAt') {
    this.name = collectionName;
    this.dateKey = dateKey;
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  _read() {
    try {
      const content = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(content || '[]');
    } catch {
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async create(item) {
    const data = this._read();
    const newItem = {
      id: crypto.randomUUID(),
      ...item,
      [this.dateKey]: item[this.dateKey] ? new Date(item[this.dateKey]).toISOString() : new Date().toISOString(),
    };
    data.unshift(newItem);
    this._write(data);
    return { ...newItem };
  }

  async find(query = {}) {
    const data = this._read();
    return data.filter((row) => {
      for (const [key, val] of Object.entries(query)) {
        if (typeof val === 'string') {
          if (row[key]?.toString().toLowerCase() !== val.toLowerCase()) return false;
        } else if (row[key] !== val) {
          return false;
        }
      }
      return true;
    });
  }

  async findOne(query = {}) {
    const results = await this.find(query);
    return results[0] || null;
  }

  async findById(id) {
    const data = this._read();
    return data.find((row) => row.id === id) || null;
  }

  async findByIdAndDelete(id) {
    const data = this._read();
    const index = data.findIndex((row) => row.id === id);
    if (index === -1) return null;
    const deleted = data.splice(index, 1)[0];
    this._write(data);
    return deleted;
  }

  async findByIdAndUpdate(id, updateData) {
    const data = this._read();
    const index = data.findIndex((row) => row.id === id);
    if (index === -1) return null;
    data[index] = { ...data[index], ...updateData };
    this._write(data);
    return { ...data[index] };
  }

  async countDocuments(query = {}) {
    const results = await this.find(query);
    return results.length;
  }
}

const localUsers = new LocalCollection('users', 'createdAt');
const localContacts = new LocalCollection('contacts', 'createdAt');
const localNewsletter = new LocalCollection('newsletter', 'subscribedAt');
const localQuotes = new LocalCollection('quotes', 'createdAt');
const localEmployees = new LocalCollection('employees', 'createdAt');

// -------------------------------------------------------------
// 4. Unified Collection Repositories (Auto Mongo / Fallback)
// -------------------------------------------------------------
function createRepository(model, localFallback, dateKey = 'createdAt') {
  return {
    async create(data) {
      if (isMongoConnected) {
        try {
          const doc = await model.create(data);
          return doc.toJSON();
        } catch (err) {
          console.error(`Error saving to Mongo: ${err.message}. Saving to local backup.`);
        }
      }
      return await localFallback.create(data);
    },

    async find(query = {}, sort = { [dateKey]: -1 }) {
      if (isMongoConnected) {
        try {
          const docs = await model.find(query).sort(sort);
          return docs.map((d) => d.toJSON());
        } catch (err) {
          console.error(`Error querying Mongo: ${err.message}. Querying local.`);
        }
      }
      return await localFallback.find(query);
    },

    async findOne(query = {}) {
      if (isMongoConnected) {
        try {
          const doc = await model.findOne(query);
          return doc ? doc.toJSON() : null;
        } catch (err) {
          console.error(`Error querying Mongo: ${err.message}. Querying local.`);
        }
      }
      return await localFallback.findOne(query);
    },

    async findById(id) {
      if (isMongoConnected) {
        try {
          if (mongoose.Types.ObjectId.isValid(id)) {
            const doc = await model.findById(id);
            return doc ? doc.toJSON() : null;
          }
        } catch (err) {
          console.error(`Error querying Mongo: ${err.message}. Querying local.`);
        }
      }
      return await localFallback.findById(id);
    },

    async findByIdAndUpdate(id, updateData) {
      if (isMongoConnected) {
        try {
          if (mongoose.Types.ObjectId.isValid(id)) {
            const doc = await model.findByIdAndUpdate(id, updateData, { new: true });
            return doc ? doc.toJSON() : null;
          }
        } catch (err) {
          console.error(`Error updating in Mongo: ${err.message}. Updating local.`);
        }
      }
      return await localFallback.findByIdAndUpdate(id, updateData);
    },

    async findByIdAndDelete(id) {
      if (isMongoConnected) {
        try {
          if (mongoose.Types.ObjectId.isValid(id)) {
            const doc = await model.findByIdAndDelete(id);
            return doc ? doc.toJSON() : null;
          }
        } catch (err) {
          console.error(`Error deleting from Mongo: ${err.message}. Deleting from local.`);
        }
      }
      return await localFallback.findByIdAndDelete(id);
    },

    async countDocuments(query = {}) {
      if (isMongoConnected) {
        try {
          return await model.countDocuments(query);
        } catch (err) {
          console.error(`Error counting in Mongo: ${err.message}. Counting local.`);
        }
      }
      return await localFallback.countDocuments(query);
    },
  };
}

export const Users = createRepository(UserModel, localUsers, 'createdAt');
export const Contacts = createRepository(ContactModel, localContacts, 'createdAt');
export const Newsletter = createRepository(NewsletterModel, localNewsletter, 'subscribedAt');
export const Quotes = createRepository(QuoteModel, localQuotes, 'createdAt');
export const Employees = createRepository(EmployeeModel, localEmployees, 'createdAt');
