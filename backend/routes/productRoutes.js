const express = require('express');
const router = express.Router();
const { addReview } = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const Joi = require('joi');
const validate = require('../middleware/validate');

const reviewSchema = Joi.object({
    productId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().optional(),
});

router.post('/review', protect, validate(reviewSchema), addReview);

module.exports = router;