import socketIO from 'socket.io';
let io;

export default {
  init: httpServer => {
    io = socketIO(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('socket not initialized!');
    }
    return io;
  },
};
