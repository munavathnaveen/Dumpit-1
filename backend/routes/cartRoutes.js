const express = require('express');
const router = express.Router();
const { addToCart, getCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const Joi = require('joi');
const validate = require('../middleware/validate');

const cartSchema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
});

router.post('/', protect, validate(cartSchema), addToCart);
router.get('/', protect, getCart);

module.exports = router;