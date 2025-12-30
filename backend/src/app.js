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

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Error Handler
app.use(errorHandler);

module.exports = app;
