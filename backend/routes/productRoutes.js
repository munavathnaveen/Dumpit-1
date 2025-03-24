const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByVendor,
  searchProducts
} = require('../controllers/productController');
const { addReview } = require('../controllers/productController');
const Joi = require('joi');
const validate = require('../middleware/validate');

const reviewSchema = Joi.object({
    productId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().optional(),
});

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

// Protected routes (vendor only)
router.post('/', protect, authorize('vendor'), createProduct);
router.put('/:id', protect, authorize('vendor'), updateProduct);
router.delete('/:id', protect, authorize('vendor'), deleteProduct);

// Vendor specific routes
router.get('/vendor/:vendorId', getProductsByVendor);

router.post('/review', protect, validate(reviewSchema), addReview);

module.exports = router;