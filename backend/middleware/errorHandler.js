const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(`${err.name}: ${err.message}`);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;