const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
// @example Usage:
//    GET /api/admin/users?role=vendor&createdAtStart=2025-01-01&createdAtEnd=2025-12-31
//    Response: Returns a list of users filtered by role and creation date
const getUsers = asyncHandler(async (req, res) => {
    const { role, createdAtStart, createdAtEnd } = req.query;
    let query = {};
    if (role) query.role = role;
    if (createdAtStart || createdAtEnd) {
        query.createdAt = {};
        if (createdAtStart) query.createdAt.$gte = new Date(createdAtStart);
        if (createdAtEnd) query.createdAt.$lte = new Date(createdAtEnd);
    }
    const users = await User.find(query).select('-password');
    res.json(users);
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id
// @access  Private (admin)
// @example Usage:
//    PUT /api/admin/users/123
//    Request Body: { "role": "vendor" }
//    Response: Returns the updated user details
const updateUserRole = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    user.role = req.body.role || user.role;
    await user.save();
    res.json({ message: 'User role updated', user });
});

// @desc    Get all vendors
// @route   GET /api/admin/vendors
// @access  Private (admin)
// @example Usage:
//    GET /api/admin/vendors?status=approved&shopName=electronics
//    Response: Returns a list of vendors filtered by status and shop name
const getVendors = asyncHandler(async (req, res) => {
    const { status, shopName } = req.query;
    let query = {};
    if (status) query.status = status;
    if (shopName) query.shopName = { $regex: shopName, $options: 'i' };
    const vendors = await Vendor.find(query).populate('user', '-password');
    res.json(vendors);
});

// @desc    Approve or suspend vendor
// @route   PUT /api/admin/vendors/:id
// @access  Private (admin)
// @example Usage:
//    PUT /api/admin/vendors/123
//    Request Body: { "status": "suspended" }
//    Response: Returns the updated vendor details
const updateVendorStatus = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
        res.status(404);
        throw new Error('Vendor not found');
    }
    vendor.status = req.body.status || vendor.status;
    await vendor.save();
    res.json({ message: 'Vendor status updated', vendor });
});

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private (admin)
// @example Usage:
//    GET /api/admin/orders?status=shipped&createdAtStart=2025-01-01&amountMin=1000
//    Response: Returns a list of all orders with detailed information
const getAllOrders = asyncHandler(async (req, res) => {
    const { status, createdAtStart, createdAtEnd, amountMin, amountMax } = req.query;
    let query = {};
    if (status) query.status = status;
    if (createdAtStart || createdAtEnd) {
        query.createdAt = {};
        if (createdAtStart) query.createdAt.$gte = new Date(createdAtStart);
        if (createdAtEnd) query.createdAt.$lte = new Date(createdAtEnd);
    }
    if (amountMin || amountMax) {
        query.totalAmount = {};
        if (amountMin) query.totalAmount.$gte = Number(amountMin);
        if (amountMax) query.totalAmount.$lte = Number(amountMax);
    }
    const orders = await Order.find(query)
        .populate('user', 'name email')
        .populate('vendor')
        .populate('products.product')
        .populate('payment');
    res.json(orders);
});

module.exports = { getUsers, updateUserRole, getVendors, updateVendorStatus, getAllOrders };