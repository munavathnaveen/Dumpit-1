const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Add a review to a product
// @route   POST /api/products/review
// @access  Private (user)
// @example Usage:
//    POST /api/products/review
//    Request Body:
//      {
//        "productId": "productId123",
//        "rating": 4,
//        "comment": "Great product!"
//      }
const addReview = asyncHandler(async (req, res) => {
    const { productId, rating, comment } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Check if rating is valid
    if (rating < 1 || rating > 5) {
        res.status(400);
        throw new Error('Rating must be between 1 and 5');
    }

    // Add the review to the product
    product.reviews.push({ user: req.user._id, rating, comment });

    // Calculate the new average rating
    product.averageRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

    // Save the updated product
    await product.save();

    res.json({ message: 'Review added successfully', product });
});

module.exports = { addReview };
