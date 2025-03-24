const asyncHandler = require('express-async-handler');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register Vendor
// @route   POST /api/vendors/register
// @access  Private (vendor)
// @example Usage:
//    POST /api/vendors/register 
//    Request Body: { "shopName": "My Shop", "description": "Best products in town" }
//    Response: Returns the created vendor profile
const registerVendor = asyncHandler(async (req, res) => {
    const { shopName, description } = req.body;
    const user = await User.findById(req.user._id);

    if (user.role !== 'vendor') {
        user.role = 'vendor';
        await user.save();
    }

    const vendorExists = await Vendor.findOne({ user: req.user._id });
    if (vendorExists) {
        res.status(400);
        throw new Error('Vendor profile already exists');
    }

    const vendor = await Vendor.create({
        user: req.user._id,
        shopName,
        description,
    });

    res.status(201).json(vendor);
});

// @desc    Get Vendor Profile
// @route   GET /api/vendors/profile
// @access  Private (vendor)
// @example Usage:
//    GET /api/vendors/profile
//    Response: Returns the vendor profile
const getVendorProfile = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findOne({ user: req.user._id }).populate('user', '-password');
    if (!vendor) {
        res.status(404);
        throw new Error('Vendor profile not found');
    }
    res.json(vendor);
});

// @desc    Update Vendor Profile
// @route   PUT /api/vendors/profile
// @access  Private (vendor)
// @example Usage:
//    PUT /api/vendors/profile 
//    Request Body: { "shopName": "New Shop", "description": "Updated description" }
//    Response: Returns the updated vendor profile
const updateVendorProfile = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
        res.status(404);
        throw new Error('Vendor profile not found');
    }

    vendor.shopName = req.body.shopName || vendor.shopName;
    vendor.description = req.body.description || vendor.description;
    vendor.status = req.body.status || vendor.status;
    await vendor.save();

    res.json(vendor);
});

// @desc    Get Vendor Dashboard
// @route   GET /api/vendors/dashboard
// @access  Private (vendor)
// @example Usage:
//    GET /api/vendors/dashboard
//    Response: Returns vendor dashboard data including sales and order statistics
const getVendorDashboard = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findOne({ user: req.user._id });
    const orders = await Order.find({ vendor: vendor._id })
        .populate('products.product')
        .populate('payment');
    const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const products = await Product.find({ vendor: vendor._id });

    const orderStats = {
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
    };

    res.json({
        totalSales,
        orderCount: orders.length,
        productCount: products.length,
        orderStats,
        orders,
        products,
    });
});

// @desc    Add Product to Vendor Shop
// @route   POST /api/vendors/products
// @access  Private (vendor)
// @example Usage:
//    POST /api/vendors/products 
//    Request Body: { "name": "New Product", "description": "Product description", "price": 100, "stock": 50, "category": "electronics", "images": ["image1.jpg"] }
//    Response: Returns the created product
const addProduct = asyncHandler(async (req, res) => {
    const { name, description, price, stock, category, images } = req.body;
    const vendor = await Vendor.findOne({ user: req.user._id });

    const product = await Product.create({
        name,
        description,
        price,
        stock,
        category,
        vendor: vendor._id,
        images,
    });

    res.status(201).json(product);
});

// @desc    Get all vendors
// @route   GET /api/vendors
// @access  Public
const getVendors = asyncHandler(async (req, res, next) => {
  const vendors = await User.find({ role: 'vendor' });
  res.status(200).json({
    success: true,
    count: vendors.length,
    data: vendors
  });
});

// @desc    Get nearby vendors
// @route   GET /api/vendors/nearby
// @access  Public
const getNearbyVendors = asyncHandler(async (req, res, next) => {
  const { longitude, latitude, maxDistance = 10000 } = req.query; // maxDistance in meters

  if (!longitude || !latitude) {
    return next(new ErrorResponse('Please provide longitude and latitude', 400));
  }

  const vendors = await User.find({
    role: 'vendor',
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        $maxDistance: parseInt(maxDistance)
      }
    }
  }).select('name email phone location');

  res.status(200).json({
    success: true,
    count: vendors.length,
    data: vendors
  });
});

// @desc    Get single vendor
// @route   GET /api/vendors/:id
// @access  Public
const getVendor = asyncHandler(async (req, res, next) => {
  const vendor = await User.findOne({ _id: req.params.id, role: 'vendor' });

  if (!vendor) {
    return next(new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: vendor
  });
});

// @desc    Create new vendor
// @route   POST /api/vendors
// @access  Private/Admin
const createVendor = asyncHandler(async (req, res, next) => {
  const vendor = await User.create({
    ...req.body,
    role: 'vendor'
  });

  res.status(201).json({
    success: true,
    data: vendor
  });
});

// @desc    Update vendor
// @route   PUT /api/vendors/:id
// @access  Private/Admin
const updateVendor = asyncHandler(async (req, res, next) => {
  let vendor = await User.findOne({ _id: req.params.id, role: 'vendor' });

  if (!vendor) {
    return next(new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404));
  }

  vendor = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: vendor
  });
});

// @desc    Delete vendor
// @route   DELETE /api/vendors/:id
// @access  Private/Admin
const deleteVendor = asyncHandler(async (req, res, next) => {
  const vendor = await User.findOne({ _id: req.params.id, role: 'vendor' });

  if (!vendor) {
    return next(new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404));
  }

  await vendor.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = { registerVendor, getVendorProfile, updateVendorProfile, getVendorDashboard, addProduct, getVendors, getNearbyVendors, getVendor, createVendor, updateVendor, deleteVendor };