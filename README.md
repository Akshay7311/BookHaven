# BookHaven - Online Book Store

A fully functional, production-ready MERN stack application (using MySQL instead of MongoDB).

## Tech Stack

- **Frontend**: React (Vite), React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL (using `mysql2` driver)
- **Authentication**: JWT, bcrypt

## Features

- Complete User Authentication (Register, Login, JWT verification).
- Role-based Access Control (Admin vs User). First registered user becomes Admin automatically.
- Browse, Search, and Filter books by category.
- Cart functionality synced with the database.
- Checkout simulation with stock verification and reduction.
- User Order History.
- Admin Dashboard for managing books (add, delete) and orders (view, update shipping status).

---

## Local Setup Instructions

### 1. Database Setup

1. Create a MySQL database (e.g., `bookhaven_db`).
2. Run the provided `schema.sql` script on your MySQL server to create all necessary tables.

### 2. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your MySQL credentials:

   ```env
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_here
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=bookhaven_db
   DB_PORT=3306
   CLIENT_URL=http://localhost:5173

   # Cloudinary Image Storage
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

4. Start the server (development mode):
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```

---

## Deployment Guide

### Database (Railway / PlanetScale / Aiven)

1. Create a managed MySQL database on your provider of choice.
2. Run the `schema.sql` file via a GUI client (like DBeaver or MySQL Workbench) connected to your remote database.
3. Retrieve your connection credentials (Host, User, Password, Port, Database Name).

### Cloudinary (Image Storage)

1. Create a free account at [Cloudinary](https://cloudinary.com/).
2. Navigate to your dashboard to retrieve your `Cloud Name`, `API Key`, and `API Secret`.
3. Add these to your `.env` files for both Local and Remote deployments. All image uploads (Books, Banners) use Multer middleware to pipe directly to Cloudinary.

### Backend Node.js Server (Render / Railway)

1. Push your code to GitHub.
2. Connect your repo to Render/Railway.
3. Set the deploy parameters:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add all environment variables from your `.env` to the provider's dashboard, including the remote MySQL credentials and the `CLIENT_URL` (once you deploy the frontend).

### Frontend React App (Vercel / Netlify)

1. Connect your repo to Vercel/Netlify.
2. Set the deploy parameters:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable:
   - `VITE_API_URL`: Your deployed Render/Railway backend URL (e.g., `https://your-backend.onrender.com/api`)
4. Deploy the application.
