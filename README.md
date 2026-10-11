# CampusLoop

A beginner-friendly full-stack campus buy-and-sell marketplace built with React, Vite, Node.js, Express, MongoDB and Mongoose.

## Features

- Responsive marketplace homepage
- Search and category filters
- Product details
- Student registration and login
- Password hashing and JWT authentication
- Create, view, update status and delete your own listings
- MongoDB persistence

## Requirements

- Node.js and npm
- MongoDB local installation or MongoDB Atlas account

## 1. Set up MongoDB

For a local MongoDB server, the default URI is:

`mongodb://127.0.0.1:27017/campusloop`

If using MongoDB Atlas, create a database user, allow your IP address in Network Access, and copy the connection string.

## 2. Configure backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set `MONGODB_URI` and a long random `JWT_SECRET`. Keep `.env private.

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Test `http://localhost:5000/api/health`.

## 3. Configure frontend

Open a second terminal from the CampusLoop root:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the URL Vite prints, normally `http://localhost:5173`.

## 4. Try it

1. Register a student account.
2. Log in.
3. Select Sell item and create a listing.
4. Return to Explore to see the listing.
5. Open the listing to view details or mark it as sold.
6. Visit My listings to manage your products.

## API routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/products/my/listings` (requires login)
- `POST /api/products` (requires login)
- `PUT /api/products/:id` (requires owner login)
- `DELETE /api/products/:id` (requires owner login)

## Important notes

- Never commit `.env` files or expose your MongoDB connection string or JWT secret.
- This is an educational project. Before public deployment, add rate limiting, stronger input validation, secure deployment configuration, moderation/reporting, and a safer image-upload service.
- Product images are entered as image URLs in this starter version.
