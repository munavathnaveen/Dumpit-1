const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const User = require('../models/User');
const crypto = require('crypto');
const { notify } = require('../services/notificationService');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create an order
// @route   POST /api/orders
// @access  Private (user)
// @example Usage: 
//    POST /api/orders
//    Request Body: {
//      "products": [{"productId": "123", "quantity": 2}],
//      "vendor": "123",
//      "shippingAddress": {
//        "street": "123 Main St",
//        "city": "Mumbai",
//        "state": "MH",
//        "postalCode": "400001",
//        "country": "India"
//      }
//    }
//    Response: Returns order details and Razorpay order id
const createOrder = asyncHandler(async (req, res) => {
  const { products, vendor, shippingAddress } = req.body;
  let totalAmount = 0;

  const productDetails = await Promise.all(
    products.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        throw new Error(`Product ${product?.name || 'unknown'} unavailable`);
      }
      totalAmount += product.price * item.quantity;
      product.stock -= item.quantity;
      await product.save();
      return { product: product._id, quantity: item.quantity };
    })
  );

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  const order = await Order.create({
    user: req.user._id,
    vendor,
    products: productDetails,
    totalAmount,
    shippingAddress,
    estimatedDelivery,
    trackingHistory: [{ status: 'pending', notes: 'Order created' }],
  });

  const options = {
    amount: totalAmount * 100,
    currency: 'INR',
    receipt: order._id.toString(),
  };

  const razorpayOrder = await razorpay.orders.create(options);
  const payment = await Payment.create({
    order: order._id,
    amount: totalAmount,
    razorpayOrderId: razorpayOrder.id,
  });

  order.payment = payment._id;
  await order.save();

  const user = await User.findById(req.user._id);
  user.purchaseHistory.push(order._id);
  await user.save();

  notify(req.user._id, 'Order Created',
    `Your order #${order._id} has been created. Amount: ₹${totalAmount}`,
    'pending', order._id
  );

  res.json({
    orderId: order._id,
    razorpayOrderId: razorpayOrder.id,
    amount: totalAmount,
    key: process.env.RAZORPAY_KEY_ID
  });
});

// @desc    Verify payment for an order
// @route   POST /api/orders/verify-payment
// @access  Private (user)
// @example Usage:
//    POST /api/orders/verify-payment
//    Request Body: {
//      "orderId": "123",
//      "razorpayPaymentId": "pay_123",
//      "razorpayOrderId": "order_123",
//      "razorpaySignature": "signature"
//    }
//    Response: Returns payment verification status and order details
const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

  const payment = await Payment.findOne({ razorpayOrderId });
  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpayOrderId + '|' + razorpayPaymentId)
    .digest('hex');

  if (generatedSignature !== razorpaySignature) {
    payment.status = 'failed';
    payment.attempts += 1;
    payment.lastAttemptAt = new Date();
    await payment.save();

    order.status = 'cancelled';
    order.trackingHistory.push({
      status: 'cancelled',
      notes: 'Payment verification failed'
    });
    await order.save();

    throw new Error('Invalid payment signature');
  }

  const paymentDetails = await razorpay.payments.fetch(razorpayPaymentId);

  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = 'captured';
  payment.paymentMethod = paymentDetails.method;
  payment.attempts += 1;
  payment.lastAttemptAt = new Date();
  await payment.save();

  order.status = 'processing';
  order.trackingHistory.push({
    status: 'processing',
    notes: 'Payment successful'
  });
  await order.save();

  notify(order.user, 'Payment Successful',
    `Payment for order #${orderId} was successful. Amount: ₹${payment.amount}`,
    'processing', orderId
  );

  res.json({ message: 'Payment verified successfully', order, payment });
});

// @desc    Update order status
// @route   PUT /api/orders/status
// @access  Private (vendor or admin)
// @example Usage:
//    PUT /api/orders/status
//    Request Body: {
//      "orderId": "123",
//      "status": "shipped",
//      "trackingNumber": "ABCD1234",
//      "latitude": 28.704060,
//      "longitude": 77.102493,
//      "address": "Warehouse 1",
//      "notes": "Shipped via courier",
//      "estimatedDelivery": "2025-03-28T00:00:00.000Z"
//    }
//    Response: Returns updated order details
const updateOrderStatus = asyncHandler(async (req, res) => {
  const {
    orderId,
    status,
    trackingNumber,
    latitude,
    longitude,
    address,
    notes,
    estimatedDelivery
  } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status || order.status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;
  if (status === 'delivered') order.actualDelivery = new Date();

  const trackingUpdate = {
    status: status || order.status,
    notes: notes || `Status updated to ${status}`,
  };

  if (latitude && longitude) {
    trackingUpdate.location = {
      latitude,
      longitude,
      address: address || order.shippingAddress.street
    };
  }

  order.trackingHistory.push(trackingUpdate);
  await order.save();

  notify(order.user, 'Order Update',
    `Order #${orderId} is now ${status}.`,
    status, orderId, trackingUpdate.location
  );

  res.json(order);
});

// @desc    Get order tracking details
// @route   GET /api/orders/:orderId/tracking
// @access  Private (user)
// @example Usage: 
//    GET /api/orders/123/tracking
//    Response: Returns detailed order tracking information
const getOrderTracking = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId)
    .populate('products.product')
    .populate('payment');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json({
    orderId: order._id,
    status: order.status,
    trackingNumber: order.trackingNumber,
    trackingHistory: order.trackingHistory,
    paymentStatus: order.payment?.status,
    estimatedDelivery: order.estimatedDelivery,
    actualDelivery: order.actualDelivery,
    shippingAddress: order.shippingAddress
  });
});

// @desc    Get all orders for a user
// @route   GET /api/orders
// @access  Private (user)
// @example Usage: 
//    GET /api/orders?status=shipped&createdAtStart=2025-01-01&createdAtEnd=2025-12-31
//    Response: Returns a list of user's orders based on filter criteria
const getOrders = asyncHandler(async (req, res) => {
  const { status, createdAtStart, createdAtEnd, amountMin, amountMax } = req.query;
  let query = { user: req.user._id };

  if (status) query.status = status;
  if (createdAtStart || createdAtEnd) {
    query.createdAt = {};
    if (createdAtStart) query.createdAt.$gte = new Date(createdAtStart);
    if (createdAtEnd) query.createdAt.$lte = new Date(createdAtEnd);
  }
  if (amountMin || amountMax) {
    query.totalAmount = {};
    if (amountMin) query.totalAmount.$gte = Number(amountMin);
    if (amountMax) query.totalAmount.$lte = Number(amountMax);
  }

  const orders = await Order.find(query)
    .populate('products.product')
    .populate('payment');
  res.json(orders);
});

// @desc    Refund a payment
// @route   POST /api/orders/refund
// @access  Private (vendor or admin)
// @example Usage:
//    POST /api/orders/refund
//    Request Body: {
//      "orderId": "123",
//      "amount": 500
//    }
//    Response: Returns refund details
const refundPayment = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body;

  const order = await Order.findById(orderId).populate('payment');
  if (!order || !order.payment) {
    res.status(404);
    throw new Error('Order or payment not found');
  }

  const refundAmount = amount || order.payment.amount;

  const refund = await razorpay.payments.refund(order.payment.razorpayPaymentId, {
    amount: refundAmount * 100,
  });

  order.payment.status = 'refunded';
  order.payment.refundId = refund.id;
  order.payment.refundAmount = refundAmount;
  await order.payment.save();

  order.status = 'returned';
  order.trackingHistory.push({
    status: 'returned',
    notes: `Refunded amount: ₹${refundAmount}`
  });
  await order.save();

  notify(order.user, 'Refund Processed',
    `Refund of ₹${refundAmount} processed for order #${orderId}`,
    'returned', orderId
  );

  res.json({ message: 'Refund processed successfully', refund });
});

module.exports = {
  createOrder,
  verifyPayment,
  updateOrderStatus,
  getOrderTracking,
  getOrders,
  refundPayment
};