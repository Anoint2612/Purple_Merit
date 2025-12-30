const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return errorResponse(res, 'Not authorized to access this route', 401);
    }

    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            return errorResponse(res, 'Invalid token', 401);
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return errorResponse(res, 'No user found with this id', 404);
        }

        if (user.status !== 'active') {
            return errorResponse(res, 'User account is inactive', 403);
        }

        req.user = user;
        next();
    } catch (error) {
        return errorResponse(res, 'Not authorized to access this route', 401);
    }
};

module.exports = protect;
