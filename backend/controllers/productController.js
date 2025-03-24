const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate('vendor', 'name')
    .populate('category', 'name');
  res.json(products);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('vendor', 'name')
    .populate('category', 'name')
    .populate('reviews.user', 'name');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Vendor
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    vendor: req.user._id
  });
  res.status(201).json(product);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Vendor
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.vendor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this product');
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedProduct);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Vendor
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.vendor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this product');
  }

  await product.remove();
  res.json({ message: 'Product removed' });
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({ category: req.params.category })
    .populate('vendor', 'name')
    .populate('category', 'name');
  res.json(products);
});

// @desc    Get products by vendor
// @route   GET /api/products/vendor/:vendorId
// @access  Public
const getProductsByVendor = asyncHandler(async (req, res) => {
  const products = await Product.find({ vendor: req.params.vendorId })
    .populate('vendor', 'name')
    .populate('category', 'name');
  res.json(products);
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  const { query, category, minPrice, maxPrice, sort } = req.query;
  let searchQuery = {};

  if (query) {
    searchQuery.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ];
  }

  if (category) {
    searchQuery.category = category;
  }

  if (minPrice || maxPrice) {
    searchQuery.price = {};
    if (minPrice) searchQuery.price.$gte = Number(minPrice);
    if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
  }

  let sortOption = {};
  if (sort) {
    switch (sort) {
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'rating-desc':
        sortOption = { rating: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
  }

  const products = await Product.find(searchQuery)
    .sort(sortOption)
    .populate('vendor', 'name')
    .populate('category', 'name');

  res.json(products);
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByVendor,
  searchProducts
};
