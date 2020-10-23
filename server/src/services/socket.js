import socketIO from 'socket.io';
let io;

export default {
  init: httpServer => {
    io = socketIO(httpServer, {
      pingTimeout: 1200000, //how many ms without a pong packet to consider the connection closed
      pingInterval: 1225000, //how many ms before sending a new ping packet
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('socket not initialized!');
    }
    return io;
  },
};
