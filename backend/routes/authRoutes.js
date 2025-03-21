const express = require('express');
const router = express.Router();
const { signup, login, forgotPassword, resetPassword, logout } = require('../controllers/authController');
const validate = require('../middleware/validate');
const authLimiter = require('../middleware/rateLimit');
const Joi = require('joi');
const { protect } = require('../middleware/auth');

const signupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('user', 'vendor', 'admin'),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

router.post('/signup', validate(signupSchema), authLimiter, signup);
router.post('/login', validate(loginSchema), authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/logout', protect, logout);

module.exports = router;