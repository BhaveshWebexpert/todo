import Joi from 'joi';

const today = new Date();
today.setHours(0, 0, 0, 0);

export const taskValidationSchema = Joi.object({
    title: Joi.string()
        .trim()
        .required(),
        
    description: Joi.string()
        .trim()
        .optional()
        .allow(''),
        
    status: Joi.boolean()
        .optional()
        .default(false),
        
    due: Joi.date()
        .min(today)
        .required()
        .messages({
            'date.min': 'The due date cannot be in the past!'
        })
});

export const validateTask = (req, res, next) => {
    const { error } = taskValidationSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: "Validation Error",
            errors: error.details.map(err => err.message) 
        });
    }

    next();
};