const express = require('express');
const { getMe, updateProfile, changePassword } = require('../controllers/user.controller');
const protect = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validate.middleware');

const router = express.Router();

router.use(protect);

router.get('/me', getMe);
router.put('/me', validate(schemas.updateProfile), updateProfile);
router.put('/me/password', validate(schemas.changePassword), changePassword);

module.exports = router;
