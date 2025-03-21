const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: {
        type: String,
        enum: ['created', 'authorized', 'captured', 'failed', 'refunded'],
        default: 'created'
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'upi', 'netbanking', 'wallet'],
    },
    attempts: { type: Number, default: 0 },
    lastAttemptAt: { type: Date },
    refundId: { type: String },
    refundAmount: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);