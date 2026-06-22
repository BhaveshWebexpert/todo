import Joi from 'joi';

export const userValidationSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Name cannot be empty.',
            'string.min': 'Name must be at least 2 characters long.',
            'any.required': 'Name is required.'
        }),
        
    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address.',
            'string.empty': 'Email cannot be empty.',
            'any.required': 'Email is required.'
        }),
        
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long.',
            'string.empty': 'Password cannot be empty.',
            'any.required': 'Password is required.'
        })
});

export const validateUser = (req, res, next) => {
    const { error } = userValidationSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: "Validation Error",
            errors: error.details.map(err => err.message) 
        });
    }

    next();
};