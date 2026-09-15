# Orbit Works — Employee Assistant Dashboard & Backend

A full-stack modern intelligent workplace application combining a React frontend with a complete Node.js + Express backend powered by **MongoDB Atlas** (via Mongoose) with an automatic persistent collection store fallback.

---

## Table of Contents

- [Features](#features)
- [Database: MongoDB Atlas](#database-mongodb-atlas)
- [Admin Credentials & Seed Script](#admin-credentials--seed-script)
- [Quick Start Guide](#quick-start-guide)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [Deployment](#deployment)
- [Configuring MongoDB Atlas](#configuring-mongodb-atlas)
- [Database Collections Schema](#database-collections-schema)
- [API Reference](#api-reference)
- [Frontend Pages & Integration](#frontend-pages--integration)

---

## Features

1. **Contact Form Backend (`/contact`)**:
   - Endpoint: `POST /api/contact`
   - Full server-side field and email format validation.
   - Real-time success and error banners on the frontend.
2. **User Authentication System (`/login`, `/register`)**:
   - `POST /api/auth/register` with bcrypt-hashed passwords.
   - `POST /api/auth/login` returning 7-day signed JWT tokens.
   - `GET /api/auth/profile` protected route for authenticated user info.
   - Dynamic user name display & avatar initials in topbar navbar.
   - Working Logout button that clears tokens from `localStorage`.
3. **Admin Panel (`/admin`)**:
   - Admin-only protected endpoints (`GET /api/admin/contacts`, `DELETE /api/admin/contacts/:id`, `GET /api/admin/users`, `GET /api/admin/quotes`).
   - Frontend table views for all collections with live metrics and submission deletion.
   - Access-restricted (returns `401 Unauthorized` without admin token).
4. **Newsletter Subscription (Homepage Footer)**:
   - Endpoint: `POST /api/newsletter/subscribe`
   - Server-side email format validation.
   - Duplicate prevention returning: `"You are already subscribed"`.
   - Real-time inline feedback in the footer.
5. **Get a Free Quote Modal (Homepage)**:
   - Working modal dialog opened via "Get a Free Quote" buttons.
   - Fields: Name, Email, Phone, Service Required (dropdown), Budget (dropdown), Message.
   - Saves to `Quotes` collection via `POST /api/quote`.
   - Quote requests visible and manageable in the Admin Portal.

---

## Database: MongoDB Atlas

The backend is built with **Mongoose** connecting directly to **MongoDB Atlas**.

- **Primary Database**: MongoDB Atlas cluster configured via `MONGODB_URI` in `backend/.env`.
- **Zero-Setup Fallback Store**: The database engine contains an automatic fallback to local JSON persistence (`backend/data/`). If MongoDB Atlas is not yet configured or offline, the server and seed scripts operate instantly and reliably without any server crashes or broken endpoints. When connected to Atlas, all data persists to your cloud MongoDB Atlas database.

---

## Admin Credentials & Seed Script

We provide an automated seed script to populate an initial administrator account, sample contacts, quote requests, and newsletter subscribers.

### Default Admin Credentials:
| Field | Value |
| :--- | :--- |
| **Email** | `admin@orbitworks.com` |
| **Password** | `AdminPassword123!` |
| **Role** | `admin` |

### To run the seed script:
```bash
# From the backend directory:
cd backend
npm run seed

# OR from the root directory:
npm run seed
```

---

## Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- npm (installed with Node.js)

---

### 1. Backend Setup

```bash
# Navigate to the backend folder
cd backend

# Install dependencies (express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv)
npm install

# Seed the admin user and initial demo data
npm run seed

# Start the backend server (runs on http://localhost:5000)
npm start
```

> **Tip**: For development with automatic file reloading, run:
> ```bash
> npm run dev
> ```

---

### 2. Frontend Setup

In a separate terminal window:

```bash
# Navigate to the frontend folder
cd frontend

# Install frontend dependencies
npm install

# Start the Vite development server (runs on http://localhost:5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. All `/api` requests from the frontend are automatically proxied to the backend on `http://localhost:5000`.

## Deployment

The repository includes `render.yaml` for deploying the backend to Render. Create a new Render Blueprint from this repository, or create a Web Service manually with these settings:

| Setting | Value |
| :--- | :--- |
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

Set these Render environment variables:

```env
FRONTEND_URL=https://orbitworks-employee-dashboard.vercel.app
JWT_SECRET=<long-random-secret>
MONGODB_URI=<your-mongodb-atlas-connection-string>
```

MongoDB Atlas is required for persistent production data. Render's local filesystem is ephemeral, so the JSON fallback in `backend/data/` is suitable for local development only.

For Vercel, set the project Root Directory to `frontend`, Framework Preset to `Vite`, and add this environment variable for Production (and Preview if needed):

```env
VITE_API_URL=https://<your-render-service>.onrender.com/api
```

The deployed frontend is [orbitworks-employee-dashboard.vercel.app](https://orbitworks-employee-dashboard.vercel.app/). After setting `VITE_API_URL`, redeploy Vercel so the value is included in the frontend bundle. The existing `frontend/vercel.json` keeps client-side routes working on refresh.

---

## Configuring MongoDB Atlas

To connect your own MongoDB Atlas database:

1. Log into your [MongoDB Atlas account](https://cloud.mongodb.com/).
2. In your Cluster, click **Connect** -> **Drivers** (Node.js).
3. Copy the connection string. It will look like:
   ```text
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/orbitworks?retryWrites=true&w=majority
   ```
4. Open `backend/.env` (or copy `backend/.env.example` to `backend/.env`).
5. Replace `<username>` and `<password>` with your database user credentials:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://your_user:your_password@cluster0.mongodb.net/orbitworks?retryWrites=true&w=majority
   JWT_SECRET=orbit_works_jwt_secret_key_2026_super_secure
   ```
6. Run `npm run seed` and restart your backend. Data will now sync directly to MongoDB Atlas!

---

## Database Collections Schema

All four required collections are implemented:

### 1. `Users`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String / ObjectId | Unique identifier |
| `name` | String | Full name |
| `email` | String | Unique email (lowercase) |
| `password` | String | Hashed using bcrypt (never stored plain) |
| `role` | String | `'user'` or `'admin'` |
| `createdAt` | Date / ISO String | Registration timestamp |

### 2. `Contacts`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String / ObjectId | Unique identifier |
| `name` | String | Sender name |
| `email` | String | Sender email address |
| `phone` | String | Sender contact number |
| `subject` | String | Message subject |
| `message` | String | Message content |
| `createdAt` | Date / ISO String | Submission timestamp |

### 3. `Newsletter`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String / ObjectId | Unique identifier |
| `email` | String | Subscriber email address (unique) |
| `subscribedAt` | Date / ISO String | Subscription timestamp |

### 4. `Quotes`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String / ObjectId | Unique identifier |
| `name` | String | Contact name |
| `email` | String | Contact email address |
| `phone` | String | Contact phone number |
| `serviceRequired` | String | Selected service from dropdown |
| `budget` | String | Selected budget range |
| `message` | String | Project description / message |
| `createdAt` | Date / ISO String | Submission timestamp |

---

## API Reference

### Contact API
- **`POST /api/contact`**
  - **Body**: `{ "name": "string", "email": "string", "phone": "string", "subject": "string", "message": "string" }`
  - **Returns**: `201 Created` with confirmation message.

### Authentication API
- **`POST /api/auth/register`**
  - **Body**: `{ "name": "string", "email": "string", "password": "string (min 6)" }`
  - **Returns**: `201 Created` with JWT token (7-day expiry) and user object.
- **`POST /api/auth/login`**
  - **Body**: `{ "email": "string", "password": "string" }`
  - **Returns**: `200 OK` with JWT token and user object.
- **`GET /api/auth/profile`** *(Protected)*
  - **Headers**: `Authorization: Bearer <token>`
  - **Returns**: `200 OK` with user profile info.

### Newsletter API
- **`POST /api/newsletter/subscribe`**
  - **Body**: `{ "email": "string" }`
  - **Returns**: `201 Created` on new subscription.
  - **Duplicate**: Returns `400 Bad Request` with `{ "error": "You are already subscribed" }`.

### Quote Request API
- **`POST /api/quote`**
  - **Body**: `{ "name": "string", "email": "string", "phone": "string", "serviceRequired": "string", "budget": "string", "message": "string" }`
  - **Returns**: `201 Created` with confirmation message.

### Admin API *(Admin Protected — returns 401 if unauthorized)*
- **`GET /api/admin/contacts`**: List all contact form submissions.
- **`DELETE /api/admin/contacts/:id`**: Delete a contact form submission.
- **`GET /api/admin/users`**: List all registered users (passwords omitted).
- **`GET /api/admin/quotes`**: List all quote requests.
- **`GET /api/admin/newsletters`**: List all newsletter subscribers.

---

## Frontend Pages & Integration

| Route | Page | Purpose |
| :--- | :--- | :--- |
| `/` | **Landing Page** | Features, "Get a Free Quote" modal trigger, Newsletter footer, Navbar auth state |
| `/dashboard` | **Overview Dashboard** | Workplace overview, metrics, and shortcuts |
| `/assistant` | **AI Assistant** | Orbit conversational AI companion |
| `/directory` | **Employee Directory** | Team members listing and search |
| `/analytics` | **Analytics** | Workplace velocity and activity metrics |
| `/contact` | **Contact Page** | Functional contact form submitting to `POST /api/contact` |
| `/login` | **Login Page** | JWT login with error banner and redirect |
| `/register` | **Register Page** | New account creation with password hashing |
| `/admin` | **Admin Portal** | Table views of Contacts, Quotes, Users, and Newsletter subscribers |
| `/settings` | **Settings** | User profile view and appearance toggle |
