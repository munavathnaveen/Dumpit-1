const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: 'Too many requests from this IP, please try again later.',
});

module.exports = authLimiter;