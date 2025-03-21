const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Search Orders
// @route   GET /api/search/orders
// @access  Private (user)
// @example Usage:
//    GET /api/search/orders?query=1234&status=shipped&sortBy=createdAt&order=desc
//    Response: Returns a list of user's orders matching the search criteria
const searchOrders = asyncHandler(async (req, res) => {
    const { query, status, sortBy = 'createdAt', order = 'desc' } = req.query;
    let filter = { user: req.user._id };

    if (query) {
        filter.$or = [{ trackingNumber: { $regex: query, $options: 'i' } }, { _id: query }];
    }
    if (status) filter.status = status;

    const orders = await Order.find(filter)
        .populate('products.product')
        .populate('payment')
        .sort({ [sortBy]: order === 'desc' ? -1 : 1 });
    res.json(orders);
});

// @desc    Search Shops (Vendors)
// @route   GET /api/search/shops
// @access  Public
// @example Usage:
//    GET /api/search/shops?query=Electronics&status=approved
//    Response: Returns a list of vendors matching the search criteria
const searchShops = asyncHandler(async (req, res) => {
    const { query, status } = req.query;
    let filter = {};
    if (query) filter.shopName = { $regex: query, $options: 'i' };
    if (status) filter.status = status;

    const vendors = await Vendor.find(filter).populate('user', '-password');
    res.json(vendors);
});

// @desc    Search Products
// @route   GET /api/search/products
// @access  Public
// @example Usage:
//    GET /api/search/products?query=Phone&minPrice=5000&maxPrice=20000&category=electronics&sortBy=price&order=asc
//    Response: Returns a list of products matching the search criteria
const searchProducts = asyncHandler(async (req, res) => {
    const { query, minPrice, maxPrice, category, sortBy = 'price', order = 'asc' } = req.query;
    let filter = {};

    if (query) filter.name = { $regex: query, $options: 'i' };
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (category) filter.category = category;

    const products = await Product.find(filter)
        .populate('category')
        .sort({ [sortBy]: order === 'desc' ? -1 : 1 });
    res.json(products);
});

// @desc    Search Categories
// @route   GET /api/search/categories
// @access  Public
// @example Usage:
//    GET /api/search/categories?query=electronics
//    Response: Returns a list of categories matching the search criteria
const searchCategories = asyncHandler(async (req, res) => {
    const { query } = req.query;
    const filter = query ? { name: { $regex: query, $options: 'i' } } : {};
    const categories = await Category.find(filter);
    res.json(categories);
});

module.exports = { searchOrders, searchShops, searchProducts, searchCategories };