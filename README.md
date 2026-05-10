# Hamari Ummeed Mission - MERN Stack NGO Platform

## Overview
A complete, production-grade MERN stack application built for the Hamari Ummeed Mission NGO. It features a polished React frontend with Framer Motion animations, a secure Node/Express backend, and MongoDB integration.

## Features
- **Frontend**: Vite + React, Custom CSS (No Tailwind), Zustand, React Router, Framer Motion
- **Backend**: Node.js, Express, MongoDB Atlas, Mongoose
- **Payments**: Razorpay Integration for Donations
- **Authentication**: JWT based Auth with HTTP-only cookies
- **Emails**: Nodemailer configuration for receipts and alerts
- **Images**: Multer + Cloudinary setup

## Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account (or local DB)
- Razorpay Account
- Cloudinary Account
- SMTP Credentials (e.g. Gmail App Password)

## Local Setup

### 1. Clone & Install
```bash
# Server Setup
cd server
npm install

# Client Setup
cd ../client
npm install
```

### 2. Environment Variables
Update the `.env` files in both `/server` and `/client` directories.
- `server/.env` (Refer to `server/.env.example`)
- `client/.env` (Refer to `client/.env`)

### 3. Seed Database
```bash
cd server
npm run seed
```
This will populate the database with dummy programs and an admin user (`admin@humariumeed.org` / `password123`).

### 4. Run Application
Run backend (Port 5000):
```bash
cd server
npm run dev
```

Run frontend (Port 5173):
```bash
cd client
npm run dev
```

## API Documentation

## Deployment Link
**Live Demo:** [https://humari-umeed-mission.vercel.app](https://humari-umeed-mission.vercel.app) *(Replace with your actual deployment link)*

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/v1/auth/login` | POST | Admin Login | Public |
| `/api/v1/campaigns` | GET | List Campaigns | Public |
| `/api/v1/donations` | POST | Create Donation | Public |
| `/api/v1/programs` | GET | List Programs | Public |

*Refer to the individual routes files for comprehensive API details.*

## Deployment
- **Frontend**: Recommended deployment on Vercel or Netlify.
- **Backend**: Recommended deployment on Render or Railway.
- **Database**: MongoDB Atlas.
