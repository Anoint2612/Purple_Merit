# Purple Merit - User Management System

## 📌 Project Overview
Purple Merit is a robust User Management System designed to handle secure authentication, role-based access control (RBAC), and user administration. It features a modern, responsive frontend and a secure, scalable backend. The application allows users to sign up, log in, and manage their profiles, while administrators can view, activate, or deactivate users via a dedicated dashboard.

## Live Project Link : https://purple-merit-zeta.vercel.app
### Backend render link : https://purple-merit-backend-5uyj.onrender.com/working

## Note : The project is RBAC so you cannot just GET the users because those can only be accessed by the admin. Login in the vercel link and see the magic 🪄

**Purpose:** To provide a secure and efficient template for user management applications with production-ready features like JWT authentication, input validation, and responsive UI.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Vanilla CSS (Glassmorphism Design), Lucide React (Icons)
- **State Management:** React Context API
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT), Bcrypt.js
- **Validation:** Joi
- **Security:** CORS, Helmet (conceptually applied via headers)

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas URI)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Anoint2612/Purple_Merit.git
cd Purple_Merit
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` root:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` root:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Port number for the server (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `NODE_ENV` | Environment mode (development/production) |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL for the backend API (e.g., `http://localhost:5000/api`) |

---

## 🌍 Deployment Instructions

### Frontend (Vercel)
1. Push your code to GitHub.
2. Import the repository in Vercel.
3. Set the **Root Directory** to `frontend`.
4. Add the Environment Variable:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api`
5. Deploy!

### Backend (Render)
1. Push your code to GitHub.
2. Create a new Web Service on Render/Railway.
3. Connect your repository and set the **Root Directory** to `backend`.
4. Set the **Build Command** to `npm install` and **Start Command** to `npm start`.
5. Add the Environment Variables (`MONGO_URI`, `JWT_SECRET`, etc.) in the dashboard.
6. Deploy!

---

## 🧪 Testing

The backend includes a comprehensive test suite using **Jest** and **Supertest** to ensure API reliability, security, and correct role-based access control.

### Running Tests
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the test script:
   ```bash
   npm test
   ```

### Test Coverage Details

#### 1. Authentication Tests (`tests/auth.test.js`)
- **Signup Flow:** Verifies that new users can register successfully and that duplicate emails are rejected.
- **Login Flow:** Checks for successful login with valid credentials and rejection of invalid ones.
- **Token Generation:** Ensures a valid JWT is returned upon login.
- **Protected Routes:** Verifies that unauthenticated requests to protected endpoints (e.g., `/auth/me`) are blocked.

#### 2. Admin & User Management Tests (`tests/admin.test.js`)
- **Admin Access:** Confirms that only users with the `admin` role can access user management endpoints.
- **User Listing:** Tests the pagination and data retrieval of the user list.
- **Status Management:** Verifies that admins can successfully activate or deactivate user accounts.
- **Security Checks:** Ensures that regular users cannot perform admin actions (e.g., deactivating another user).

### Expected Output
When running `npm test`, you should see a summary of passing tests, similar to:
```
 PASS  tests/auth.test.js
 PASS  tests/admin.test.js

Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        2.345 s
```

---

## 📡 API Documentation

**Postman Collection:** [View Collection](https://web.postman.co/workspace/Postman-API-Fundamentals-Studen~3cb0a4a7-2602-4f2a-b2e6-82668bbbe764/collection/38320399-2561bab2-8ba4-4314-a1e3-eac5488c9c33?action=share&source=copy-link&creator=38320399) (DM me and I will allow the access)

### Base URL
`http://localhost:5000/api`

### Endpoints

#### 1. Auth
- **POST** `/auth/signup`
  - **Body:** `{ "fullName": "John Doe", "email": "john@example.com", "password": "Password123" }`
  - **Response:** `201 Created` - `{ "success": true, "data": { "token": "..." } }`

- **POST** `/auth/login`
  - **Body:** `{ "email": "john@example.com", "password": "Password123" }`
  - **Response:** `200 OK` - `{ "success": true, "data": { "token": "..." } }`

- **GET** `/auth/me`
  - **Headers:** `Authorization: Bearer <token>`
  - **Response:** `200 OK` - Returns current user details.

#### 2. User (Protected)
- **PUT** `/users/me`
  - **Body:** `{ "fullName": "Jane Doe" }`
  - **Response:** `200 OK` - Profile updated.

- **PUT** `/users/me/password`
  - **Body:** `{ "currentPassword": "...", "newPassword": "..." }`
  - **Response:** `200 OK` - Password updated.

#### 3. Admin (Admin Only)
- **GET** `/admin/users`
  - **Query:** `?page=1&limit=10`
  - **Response:** `200 OK` - List of users with pagination.

- **PATCH** `/admin/users/:id/activate`
  - **Response:** `200 OK` - User activated.

- **PATCH** `/admin/users/:id/deactivate`
  - **Response:** `200 OK` - User deactivated.
