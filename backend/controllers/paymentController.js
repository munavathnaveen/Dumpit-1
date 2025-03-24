const PaymentService = require('../services/paymentService');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
exports.createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { orderId } = req.body;

  if (!orderId) {
    return next(new ErrorResponse('Please provide an order ID', 400));
  }

  const paymentIntent = await PaymentService.createPaymentIntent(orderId);

  res.status(200).json({
    success: true,
    data: paymentIntent
  });
});

// @desc    Handle successful payment
// @route   POST /api/payments/success
// @access  Private
exports.handleSuccessfulPayment = asyncHandler(async (req, res, next) => {
  const { paymentIntentId } = req.body;

  if (!paymentIntentId) {
    return next(new ErrorResponse('Please provide a payment intent ID', 400));
  }

  const payment = await PaymentService.handleSuccessfulPayment(paymentIntentId);

  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc    Handle failed payment
// @route   POST /api/payments/failure
// @access  Private
exports.handleFailedPayment = asyncHandler(async (req, res, next) => {
  const { paymentIntentId } = req.body;

  if (!paymentIntentId) {
    return next(new ErrorResponse('Please provide a payment intent ID', 400));
  }

  const payment = await PaymentService.handleFailedPayment(paymentIntentId);

  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc    Get payment details
// @route   GET /api/payments/:id
// @access  Private
exports.getPaymentDetails = asyncHandler(async (req, res, next) => {
  const payment = await PaymentService.getPaymentDetails(req.params.id);

  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc    Refund payment
// @route   POST /api/payments/:id/refund
// @access  Private/Admin
exports.refundPayment = asyncHandler(async (req, res, next) => {
  const payment = await PaymentService.refundPayment(req.params.id);

  res.status(200).json({
    success: true,
    data: payment
  });
}); 