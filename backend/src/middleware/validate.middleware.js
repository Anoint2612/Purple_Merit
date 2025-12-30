const Joi = require('joi');
const { errorResponse } = require('../utils/response');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return errorResponse(res, error.details[0].message, 400);
        }
        next();
    };
};

const schemas = {
    signup: Joi.object({
        fullName: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])')).required()
            .messages({
                'string.pattern.base': 'Password must contain at least 1 uppercase letter and 1 number'
            })
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    updateProfile: Joi.object({
        fullName: Joi.string().min(3).required(),
        email: Joi.string().email().required()
    }),
    changePassword: Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().min(8).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])')).required()
            .messages({
                'string.pattern.base': 'Password must contain at least 1 uppercase letter and 1 number'
            })
    })
};

module.exports = {
    validate,
    schemas
};
