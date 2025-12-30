const User = require('../models/user.model');
const { successResponse, errorResponse } = require('../utils/response');

exports.updateProfile = async (req, res, next) => {
    try {
        const { fullName, email } = req.body;

        const user = await User.findById(req.user.id);

        if (email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return errorResponse(res, 'Email already in use', 400);
            }
        }

        user.fullName = fullName;
        user.email = email;
        await user.save();

        successResponse(res, user, 'Profile updated successfully');
    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id).select('+password');

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return errorResponse(res, 'Incorrect current password', 400);
        }

        user.password = newPassword;
        await user.save();

        successResponse(res, {}, 'Password updated successfully');
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        successResponse(res, user);
    } catch (error) {
        next(error);
    }
};
