const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateUserRole,
  getVendors,
  updateVendorStatus,
  getAllOrders,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const Joi = require('joi');
const validate = require('../middleware/validate');

const roleSchema = Joi.object({
  role: Joi.string().valid('user', 'vendor', 'admin').required(),
});

const statusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive').required(),
});

router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id', protect, authorize('admin'), validate(roleSchema), updateUserRole);
router.get('/vendors', protect, authorize('admin'), getVendors);
router.put('/vendors/:id', protect, authorize('admin'), validate(statusSchema), updateVendorStatus);
router.get('/orders', protect, authorize('admin'), getAllOrders);

module.exports = router;