const express = require('express');
const { signup, login, logout, getMe } = require('../controllers/auth.controller');
const { validate, schemas } = require('../middleware/validate.middleware');
const protect = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/signup', validate(schemas.signup), signup);
router.post('/login', validate(schemas.login), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
