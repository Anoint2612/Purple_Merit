const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// User Dashboard
router.get('/user', verifyToken, (req, res) => {
    res.json({ message: 'Welcome to User Dashboard', user: req.user });
});

// Admin Dashboard
router.get('/admin', verifyToken, verifyRole(['admin']), (req, res) => {
    res.json({ message: 'Welcome to Admin Dashboard', user: req.user });
});

module.exports = router;
