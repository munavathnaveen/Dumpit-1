const asyncHandler = require('express-async-handler');
const NotificationSettings = require('../models/NotificationSettings');

// @desc    Get notification settings
// @route   GET /api/notifications/settings
// @access  Private
// @example Usage: Make a GET request to `/api/notifications/settings`
//  with a valid JWT token to fetch the current user's notification settings.
const getNotificationSettings = asyncHandler(async (req, res) => {
    const settings = await NotificationSettings.findOne({ user: req.user._id });
    if (!settings) {
        res.status(404);
        throw new Error('Notification settings not found');
    }
    res.json(settings);
});

// @desc    Update notification settings
// @route   PUT /api/notifications/settings
// @access  Private
// @example Usage: Make a PUT request to `/api/notifications/settings`
//  with a valid JWT token and the following body to update notification settings:
// {
//    "emailNotifications": true,
//    "smsNotifications": false,
//    "pushNotifications": true,
//    "orderNotifications": true,
//    "passwordNotifications": false
// }
const updateNotificationSettings = asyncHandler(async (req, res) => {
    const settings = await NotificationSettings.findOne({ user: req.user._id });
    if (!settings) {
        res.status(404);
        throw new Error('Notification settings not found');
    }

    settings.emailNotifications = req.body.emailNotifications ?? settings.emailNotifications;
    settings.smsNotifications = req.body.smsNotifications ?? settings.smsNotifications;
    settings.pushNotifications = req.body.pushNotifications ?? settings.pushNotifications;
    settings.orderNotifications = req.body.orderNotifications ?? settings.orderNotifications;
    settings.passwordNotifications = req.body.passwordNotifications ?? settings.passwordNotifications;
    await settings.save();

    res.json(settings);
});

module.exports = { getNotificationSettings, updateNotificationSettings };
