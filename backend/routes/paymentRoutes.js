const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createPaymentIntent,
  handleSuccessfulPayment,
  handleFailedPayment,
  getPaymentDetails,
  refundPayment
} = require('../controllers/paymentController');

// All routes are protected
router.use(protect);

// Create payment intent
router.post('/create-intent', createPaymentIntent);

// Handle payment success/failure
router.post('/success', handleSuccessfulPayment);
router.post('/failure', handleFailedPayment);

// Get payment details
router.get('/:id', getPaymentDetails);

// Refund payment (admin only)
router.post('/:id/refund', authorize('admin'), refundPayment);

module.exports = router; 