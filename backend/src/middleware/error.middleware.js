const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
    // console.error(err.stack); // Disabled for production/clean tests

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
        return errorResponse(res, 'Duplicate field value entered', 400);
    }

    // Handle Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        return errorResponse(res, message, 400);
    }

    return errorResponse(res, err.message || 'Server Error', 500);
};

module.exports = errorHandler;
