let io;

const initSocket = (socketIo) => {
  io = socketIo;
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

        socket.on('join', (userId) => {
      socket.join(userId.toString());
      console.log(`User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

const emitNotification = (userId, notification) => {
  if (io) {
    io.to(userId.toString()).emit('notification', notification);
  }
};

const emitDeliveryUpdate = (userId, orderId, status, location) => {
  if (io) {
    io.to(userId.toString()).emit('deliveryUpdate', { orderId, status, location });
  }
};

module.exports = { initSocket, emitNotification, emitDeliveryUpdate };