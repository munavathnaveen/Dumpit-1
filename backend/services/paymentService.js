const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const ErrorResponse = require('../utils/errorResponse');

class PaymentService {
  // Create a payment intent
  static async createPaymentIntent(orderId) {
    try {
      const order = await Order.findById(orderId)
        .populate('products.product')
        .populate('user');

      if (!order) {
        throw new ErrorResponse('Order not found', 404);
      }

      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.totalAmount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          orderId: order._id.toString(),
          userId: order.user._id.toString()
        }
      });

      // Create payment record in database
      const payment = await Payment.create({
        order: orderId,
        amount: order.totalAmount,
        currency: 'usd',
        paymentIntentId: paymentIntent.id,
        status: 'pending'
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id
      };
    } catch (error) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // Handle successful payment
  static async handleSuccessfulPayment(paymentIntentId) {
    try {
      const payment = await Payment.findOne({ paymentIntentId });
      if (!payment) {
        throw new ErrorResponse('Payment not found', 404);
      }

      // Update payment status
      payment.status = 'completed';
      await payment.save();

      // Update order status
      await Order.findByIdAndUpdate(payment.order, {
        'payment.status': 'completed',
        status: 'processing'
      });

      return payment;
    } catch (error) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // Handle failed payment
  static async handleFailedPayment(paymentIntentId) {
    try {
      const payment = await Payment.findOne({ paymentIntentId });
      if (!payment) {
        throw new ErrorResponse('Payment not found', 404);
      }

      // Update payment status
      payment.status = 'failed';
      await payment.save();

      // Update order status
      await Order.findByIdAndUpdate(payment.order, {
        'payment.status': 'failed',
        status: 'cancelled'
      });

      return payment;
    } catch (error) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // Get payment details
  static async getPaymentDetails(paymentId) {
    try {
      const payment = await Payment.findById(paymentId)
        .populate('order')
        .populate('order.user');

      if (!payment) {
        throw new ErrorResponse('Payment not found', 404);
      }

      return payment;
    } catch (error) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // Refund payment
  static async refundPayment(paymentId) {
    try {
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        throw new ErrorResponse('Payment not found', 404);
      }

      // Refund payment with Stripe
      await stripe.refunds.create({
        payment_intent: payment.paymentIntentId
      });

      // Update payment status
      payment.status = 'refunded';
      await payment.save();

      // Update order status
      await Order.findByIdAndUpdate(payment.order, {
        'payment.status': 'refunded',
        status: 'cancelled'
      });

      return payment;
    } catch (error) {
      throw new ErrorResponse(error.message, 500);
    }
  }
}

module.exports = PaymentService; 