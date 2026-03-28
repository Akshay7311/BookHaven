# Deployment Guide: BookHaven MERN Stack

This guide explains how to deploy the BookHaven application to GitHub, Render (Backend + Database), and Vercel (Frontend).

## 1. Push to GitHub
We have staged all the professional updates for the Catalog and Image Management.
Execute the following in your terminal:
```bash
git add .
git commit -m "Modernized image management, category filtering, and deployment prep"
git push origin main
```

## 2. Backend Deployment (Render)
Render is ideal for hosting the Express server and the MySQL/PostgreSQL database.

### Database Setup
1. Create a **New PostgreSQL** (or MySQL) instance on Render.
2. Copy the **Internal Database URL** (or External if connecting from Vercel).

### Web Service Setup
1. Create a **New Web Service** and connect your `BookHaven` GitHub repo.
2. **Root Directory**: `server`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Environment Variables**:
   - `PORT`: `5001`
   - `DATABASE_URL`: (Paste your Render internal DB URL here)
   - `JWT_SECRET`: (Generate a random string)
   - `CLIENT_URL`: `https://your-frontend-domain.vercel.app`
   - `STORAGE_MODE`: `local` (or `cloudinary` if using Cloudinary)

## 3. Frontend Deployment (Vercel)
Vercel is the best platform for Vite-based React applications.

1. Connect your `BookHaven` GitHub repo to Vercel.
2. **Root Directory**: `client`
3. **Framework Preset**: `Vite`
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend-domain.onrender.com/api`

## Important: Database Migration
After deploying the server, you need to seed your database:
1. Access the Render Shell for your Web Service.
2. Run: `npm run seed` (This will create the tables and initial data).

---
*All professional catalog fixes, separate image roles, and dynamic filtering are already included in the `main` branch!*
