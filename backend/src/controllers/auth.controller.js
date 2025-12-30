const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

exports.signup = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return errorResponse(res, 'Email already registered', 400);
        }

        const user = await User.create({
            fullName,
            email,
            password
        });

        const token = generateToken({ userId: user._id, role: user.role });

        successResponse(res, { token }, 'User registered successfully', 201);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        if (user.status !== 'active') {
            return errorResponse(res, 'Account is inactive', 403);
        }

        user.lastLogin = Date.now();
        await user.save();

        const token = generateToken({ userId: user._id, role: user.role });

        successResponse(res, { token }, 'Login successful');
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

exports.logout = (req, res) => {
    successResponse(res, {}, 'Logged out successfully');
};
