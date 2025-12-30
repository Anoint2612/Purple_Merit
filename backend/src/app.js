const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error.middleware');
const { port } = require('./config/env');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Configure CORS as needed

// Routes to check the Apis
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

app.get('/working', (req, res) => {
    res.json({
        status: 'Backend is running',
        message: 'Welcome to Purple Merit API',
        endpoints: {
            auth: [
                'POST /api/auth/signup',
                'POST /api/auth/login',
                'POST /api/auth/logout',
                'GET /api/auth/me'
            ],
            users: [
                'PUT /api/users/me',
                'PUT /api/users/me/password'
            ],
            admin: [
                'GET /api/admin/users',
                'PATCH /api/admin/users/:id/activate',
                'PATCH /api/admin/users/:id/deactivate'
            ]
        }
    });
});

// Error Handler
app.use(errorHandler);

module.exports = app;
