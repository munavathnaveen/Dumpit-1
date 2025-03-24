const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Category = require('../models/Category');
const ErrorResponse = require('../utils/errorResponse');

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

// @desc    Search products with filters
// @route   GET /api/search
// @access  Public
exports.searchProducts = asyncHandler(async (req, res, next) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    rating,
    vendor,
    sort,
    page = 1,
    limit = 10,
    tags,
    specifications,
    isActive,
    hasDiscount
  } = req.query;

  // Build query
  const query = {};

  // Text search
  if (keyword) {
    query.$text = { $search: keyword };
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  // Rating filter
  if (rating) {
    query.rating = { $gte: parseFloat(rating) };
  }

  // Vendor filter
  if (vendor) {
    query.vendor = vendor;
  }

  // Tags filter
  if (tags) {
    query.tags = { $in: tags.split(',') };
  }

  // Specifications filter
  if (specifications) {
    const specs = JSON.parse(specifications);
    Object.keys(specs).forEach(key => {
      query[`specifications.${key}`] = specs[key];
    });
  }

  // Active status filter
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  // Discount filter
  if (hasDiscount === 'true') {
    query['discount.percentage'] = { $gt: 0 };
    query['discount.validUntil'] = { $gt: new Date() };
  }

  // Build sort options
  let sortOptions = {};
  if (sort) {
    const sortFields = sort.split(',').map(field => {
      const order = field.startsWith('-') ? -1 : 1;
      return [field.replace('-', ''), order];
    });
    sortOptions = Object.fromEntries(sortFields);
  }

  // Pagination
  const start = (parseInt(page) - 1) * parseInt(limit);
  const end = start + parseInt(limit);

  // Execute query
  const products = await Product.find(query)
    .sort(sortOptions)
    .skip(start)
    .limit(parseInt(limit))
    .populate('vendor', 'name email')
    .populate('category', 'name');

  // Get total count for pagination
  const total = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    count: products.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    },
    data: products
  });
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

// @desc    Get product suggestions based on search history
// @route   GET /api/search/suggestions
// @access  Private
exports.getSearchSuggestions = asyncHandler(async (req, res, next) => {
  const { keyword } = req.query;

  if (!keyword) {
    return next(new ErrorResponse('Please provide a search keyword', 400));
  }

  const suggestions = await Product.find(
    { $text: { $search: keyword } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(5)
    .select('name category tags');

  res.status(200).json({
    success: true,
    count: suggestions.length,
    data: suggestions
  });
});

module.exports = { searchOrders, searchShops, searchProducts, searchCategories, getSearchSuggestions };