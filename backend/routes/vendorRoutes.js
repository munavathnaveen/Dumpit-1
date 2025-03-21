const express = require('express');
const router = express.Router();
const { registerVendor, getVendorProfile, updateVendorProfile, getVendorDashboard, addProduct } = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/auth');
const Joi = require('joi');
const validate = require('../middleware/validate');

const vendorSchema = Joi.object({
  shopName: Joi.string().required(),
  description: Joi.string().optional(),
});

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
  category: Joi.string().required(),
  images: Joi.array().items(Joi.string()).optional(),
});

router.post('/register', protect, validate(vendorSchema), registerVendor);
router.get('/profile', protect, authorize('vendor'), getVendorProfile);
router.put('/profile', protect, authorize('vendor'), updateVendorProfile);
router.get('/dashboard', protect, authorize('vendor'), getVendorDashboard);
router.post('/products', protect, authorize('vendor'), validate(productSchema), addProduct);

module.exports = router;