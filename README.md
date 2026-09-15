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
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

3. Restart the Vite development server after changing `.env`.
4. Open the AI Assistant page and send a message to verify the connection.

The assistant sends the latest conversation context to Gemini and retries temporary failures such as rate limits and server errors. Chat history is stored locally in the browser under the `orbit-chat` key.

### API Key Security

This project is a frontend application, so a `VITE_` environment variable is included in the browser bundle. Do not use this setup for a production application that requires a private API key. For production, move Gemini requests to a backend or serverless function and keep the key in server-side environment variables.

## Deployment on Vercel

1. Push the project to a Git repository.
2. Import the repository into Vercel.
3. Add `VITE_GEMINI_API_KEY` under Vercel Project Settings > Environment Variables.
4. Deploy the project.

The included `vercel.json` rewrites client-side routes such as `/dashboard`, `/assistant`, and `/analytics` to `index.html`, preventing 404 errors when those routes are reloaded.

## Project Structure

```text
src/
  components/       Shared layout and UI components
  data/             Employee and chart data
  pages/            Dashboard pages and views
  services/         Gemini API integration
  *.css             Global, landing, responsive, and recovery styles
```

## Available Commands

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
