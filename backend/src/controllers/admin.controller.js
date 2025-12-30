const User = require('../models/user.model');
const { successResponse, errorResponse } = require('../utils/response');

exports.getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = 10;
        const startIndex = (page - 1) * limit;

        const total = await User.countDocuments();
        const users = await User.find().skip(startIndex).limit(limit);

        successResponse(res, {
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.activateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        user.status = 'active';
        await user.save();

        successResponse(res, user, 'User activated successfully');
    } catch (error) {
        next(error);
    }
};

exports.deactivateUser = async (req, res, next) => {
    try {
        if (req.params.id === req.user.id) {
            return errorResponse(res, 'Admin cannot deactivate themselves', 400);
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        user.status = 'inactive';
        await user.save();

        successResponse(res, user, 'User deactivated successfully');
    } catch (error) {
        next(error);
    }
};
