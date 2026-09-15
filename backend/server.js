import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './models/db.js';

import contactRoutes from './routes/contact.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import newsletterRoutes from './routes/newsletter.js';
import quoteRoutes from './routes/quote.js';
import employeesRoutes from './routes/employees.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow the deployed frontend and any additional origins configured by the host.
const allowedOrigins = (process.env.FRONTEND_URL || 'https://orbitworks-employee-dashboard.vercel.app')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origin not allowed by CORS'));
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Database (MongoDB Atlas with graceful fallback)
connectDB().catch((err) => {
  console.error('DB initialization error:', err);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/quote', quoteRoutes);
app.use('/api/employees', employeesRoutes);

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'An internal server error occurred' });
});

const server = app.listen(PORT, () => {
  console.log(`[Orbit Works Backend] Server running on http://localhost:${PORT}`);
});

export default app;
export { server };
