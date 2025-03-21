const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getDashboard } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const Joi = require('joi');
const validate = require('../middleware/validate');

const updateProfileSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  addresses: Joi.array().items(Joi.string()).optional(),
  avatar: Joi.string().optional(),
  preferredCategories: Joi.array().items(Joi.string()).optional(),
  notifications: Joi.boolean().optional(),
});

router.get('/profile', protect, getProfile);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);
router.get('/dashboard', protect, getDashboard);

module.exports = router;