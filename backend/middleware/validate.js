const Joi = require('joi');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400);
            throw new Error(error.details[0].message);
        }
        next();
    };
};

module.exports = validate;