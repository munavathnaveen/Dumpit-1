const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Add a product to the cart
// @route   POST /api/cart
// @access  Private (user)
// @example Usage:
//    POST /api/cart
//    Request Body:
//      {
//        "productId": "productId123",
//        "quantity": 2
//      }
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if cart exists for the user
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  // Check if the product is already in the cart
  const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
  if (itemIndex > -1) {
    // Update the quantity if the product already exists in the cart
    cart.items[itemIndex].quantity += quantity;
  } else {
    // Add new item to the cart
    cart.items.push({ product: productId, quantity });
  }

  // Save the cart after adding/updating the item
  await cart.save();

  res.json(cart);
});

// @desc    Get the user's cart
// @route   GET /api/cart
// @access  Private (user)
// @example Usage:
//    GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  // Fetch the cart and populate the product details
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  // If cart doesn't exist, return an empty cart structure
  res.json(cart || { items: [] });
});

module.exports = { addToCart, getCart };
