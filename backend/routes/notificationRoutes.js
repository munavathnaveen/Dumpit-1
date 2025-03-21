const express = require('express');
const router = express.Router();
const { getNotificationSettings, updateNotificationSettings } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const Joi = require('joi');
const validate = require('../middleware/validate');

const notificationSchema = Joi.object({
  emailNotifications: Joi.boolean().optional(),
  smsNotifications: Joi.boolean().optional(),
  pushNotifications: Joi.boolean().optional(),
  orderNotifications: Joi.boolean().optional(),
  passwordNotifications: Joi.boolean().optional(),
});

router.get('/settings', protect, getNotificationSettings);
router.put('/settings', protect, validate(notificationSchema), updateNotificationSettings);

module.exports = router;