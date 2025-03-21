const mongoose = require('mongoose');

const notificationSettingsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: false },
    orderNotifications: { type: Boolean, default: true },
    passwordNotifications: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('NotificationSettings', notificationSettingsSchema);