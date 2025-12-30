# Backend - User-Admin Dashboard

## Overview
This is the backend for a User-Admin Dashboard application. It provides authentication, role-based access control, and user management features.

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Tokens)
- Joi (Validation)
- Jest & Supertest (Testing)

## Local Setup Steps
1. Clone the repository.
2. Navigate to the `backend` directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/purple_merit
   JWT_SECRET=supersecretkey123
   JWT_EXPIRES_IN=1d
   NODE_ENV=development
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

## Environment Variables
- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRES_IN`: JWT expiration time (e.g., 1d, 1h)
- `NODE_ENV`: Environment (development/production)

## API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user profile |

### User Routes (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | View own profile |
| PUT | `/api/users/me` | Update profile |
| PUT | `/api/users/me/password` | Change password |

### Admin Routes (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List users (paginated) |
| PATCH | `/api/admin/users/:id/activate` | Activate user |
| PATCH | `/api/admin/users/:id/deactivate` | Deactivate user |
