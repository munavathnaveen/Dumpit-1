const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendEmail } = require('../services/emailService');
const NotificationSettings = require('../models/NotificationSettings');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
// @example Usage: POST /api/auth/signup
//   Body: { "name": "John Doe", "email": "john.doe@example.com", "phone": "1234567890", "password": "password123", "role": "user" }
//   This endpoint registers a new user by accepting user details (name, email, phone, password, role).
const signup = asyncHandler(async (req, res) => {
    const { name, email, phone, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ name, email, phone, password, role });
    await NotificationSettings.create({ user: user._id });

    const token = generateToken(user._id);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// @example Usage: POST /api/auth/login
//   Body: { "email": "john.doe@example.com", "password": "password123" }
//   This endpoint logs the user in by accepting their email and password.
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        user.lastLogin = Date.now();
        await user.save();

        const token = generateToken(user._id);
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
// @example Usage: POST /api/auth/forgot-password
//   Body: { "email": "john.doe@example.com" }
//   This endpoint allows users to request a password reset by providing their email address.
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:5000/api/auth/reset-password/${resetToken}`;
    const message = `Reset your password: ${resetUrl}`;
    await sendEmail(user.email, 'Password Reset Request', message);

    res.json({ message: 'Email sent' });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
// @example Usage: POST /api/auth/reset-password/:token
//   Body: { "password": "newPassword123" }
//   This endpoint allows the user to reset their password using the token received in the password reset email.
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const resetPasswordToken = req.params.token;

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired token');
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
// @example Usage: POST /api/auth/logout
//   This endpoint logs the user out by clearing the authentication token.
const logout = asyncHandler(async (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

module.exports = { signup, login, forgotPassword, resetPassword, logout };
