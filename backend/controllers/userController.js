const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (user)
// @example Usage: 
//    GET /api/users/profile
//    Response: Returns user profile without password and refreshToken
const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -refreshToken');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json(user);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (user)
// @example Usage: 
//    PUT /api/users/profile
//    Request Body: {
//      "name": "John Doe",
//      "email": "johndoe@example.com",
//      "phone": "1234567890",
//      "addresses": ["123 Main St", "456 Another St"],
//      "avatar": "avatarUrl",
//      "preferredCategories": ["Electronics", "Fashion"],
//      "notifications": true
//    }
//    Response: Returns the updated user profile
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.addresses = req.body.addresses || user.addresses;
    user.avatar = req.body.avatar || user.avatar;
    user.preferences = {
        preferredCategories: req.body.preferredCategories || user.preferences.preferredCategories,
        notifications: req.body.notifications ?? user.preferences.notifications,
    };

    await user.save();
    res.json(user);
});

// @desc    Get user dashboard
// @route   GET /api/users/dashboard
// @access  Private (user)
// @example Usage: 
//    GET /api/users/dashboard
//    Response: Returns user dashboard data including order details, total spent, and preferences
const getDashboard = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .populate('products.product')
        .populate('payment');

    const totalSpent = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const user = await User.findById(req.user._id)
        .populate('purchaseHistory')
        .populate('preferences.preferredCategories');

    const orderStats = {
        pending: orders.filter(o => o.status === 'pending').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    res.json({
        orders,
        totalSpent,
        orderCount: orders.length,
        orderStats,
        purchaseHistory: user.purchaseHistory,
        preferences: user.preferences,
    });
});

module.exports = { getProfile, updateProfile, getDashboard };