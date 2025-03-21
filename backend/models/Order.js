const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
  }],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'pending',
  },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  trackingNumber: { type: String },
  trackingHistory: [{
    status: { type: String, required: true },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String }
    },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String }
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  estimatedDelivery: { type: Date },
  actualDelivery: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);