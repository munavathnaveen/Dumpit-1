const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shopName: { type: String, required: true },
    description: { type: String },
    totalSales: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);