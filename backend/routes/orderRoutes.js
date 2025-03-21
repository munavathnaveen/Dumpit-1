const express = require('express');
const router = express.Router();
const {
    createOrder,
    verifyPayment,
    updateOrderStatus,
    getOrderTracking,
    getOrders,
    refundPayment
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const Joi = require('joi');
const validate = require('../middleware/validate');

const orderSchema = Joi.object({
    products: Joi.array().items(
        Joi.object({
            productId: Joi.string().required(),
            quantity: Joi.number().min(1).required(),
        })
    ).required(),
    vendor: Joi.string().required(),
    shippingAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        postalCode: Joi.string().required(),
        country: Joi.string().required(),
    }).required(),
});

const paymentVerificationSchema = Joi.object({
    orderId: Joi.string().required(),
    razorpayPaymentId: Joi.string().required(),
    razorpayOrderId: Joi.string().required(),
    razorpaySignature: Joi.string().required(),
});

const statusUpdateSchema = Joi.object({
    orderId: Joi.string().required(),
    status: Joi.string().valid('pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'),
    trackingNumber: Joi.string(),
    latitude: Joi.number(),
    longitude: Joi.number(),
    address: Joi.string(),
    notes: Joi.string(),
    estimatedDelivery: Joi.date(),
});

const refundSchema = Joi.object({
    orderId: Joi.string().required(),
    amount: Joi.number().min(1),
});

router.post('/', protect, validate(orderSchema), createOrder);
router.post('/verify-payment', protect, validate(paymentVerificationSchema), verifyPayment);
router.put('/status', protect, validate(statusUpdateSchema), updateOrderStatus);
router.get('/tracking/:orderId', protect, getOrderTracking);
router.get('/', protect, getOrders);
router.post('/refund', protect, validate(refundSchema), refundPayment);

module.exports = router;