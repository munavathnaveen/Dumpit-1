const NotificationSettings = require('../models/NotificationSettings');
const { emitNotification, emitDeliveryUpdate } = require('./socketService');

// @desc    Send notifications to users
// @route   Function call: notify(userId, title, message, deliveryStatus, orderId, location)
// @access  Private
// @example Usage: 
//   const userId = "someUserId";
//   const title = "Order Update";
//   const message = "Your order has been shipped!";
//   const deliveryStatus = "shipped"; 
//   const orderId = "someOrderId"; 
//   const location = "Current location of the delivery"; 
//   notify(userId, title, message, deliveryStatus, orderId, location);
//   This will send a general notification and a delivery-specific notification if applicable.
const notify = async (userId, title, message, deliveryStatus = null, orderId = null, location = null) => {
  // Get user notification settings
  const settings = await NotificationSettings.findOne({ user: userId });
  
  // Proceed only if push notifications are enabled in the user's settings
  if (!settings || !settings.pushNotifications) return;

  // General notification (non-delivery specific)
  emitNotification(userId, { title, message });

  // If there is a delivery status and orderId, send a delivery-specific update
  if (deliveryStatus && orderId) {
    let statusMessage = '';
    
    // Set the delivery status message based on the deliveryStatus
    switch (deliveryStatus) {
      case 'shipped':
        statusMessage = 'Your order has been shipped!';
        break;
      case 'out_for_delivery':
        statusMessage = 'Your order is out for delivery.';
        break;
      case 'delivered':
        statusMessage = 'Your order has been delivered.';
        break;
      default:
        statusMessage = 'Your order status has been updated.';
        break;
    }

    // Emit a delivery-specific notification to the user
    emitNotification(userId, { title: `Order Update: ${deliveryStatus}`, message: statusMessage });

    // Emit delivery location update (e.g., tracking location or status)
    emitDeliveryUpdate(userId, orderId, deliveryStatus, location);
  }
};

module.exports = { notify };
