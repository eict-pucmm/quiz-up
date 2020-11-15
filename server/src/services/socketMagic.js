export const socketMagic = socketio => {
  socketio.on('connection', socket => {
    console.log('Client connected');

    socket.on('joinRoom', ({ teamName, roomId }) => {
      socket.join(roomId);

      socket.to(roomId).emit('welcomeTeam', teamName);

      //listen for question opening
      socket.on('question', questionStatus => {
        socketio.to(roomId).emit('question', questionStatus);
      });

      socket.on('subscribeToIndex', ({ index, open }) => {
        socketio.to(roomId).emit('index', { index, open });
      });
    });

    //start/stop timer
    socket.on('countdown', ({ roomId, status }) => {
      let countdown = 15;
      const counting = status;

      setInterval(() => {
        if (!counting) return;
        if (countdown <= 0) return;
        countdown--;
        socketio.to(roomId).emit('timer', { timer: countdown, open: counting });
      }, 1000);
    });

    socket.on('answer', ({ teamInfo, roomId }) => {
      socketio.to(roomId).emit('answer', teamInfo);
    });

    socket.on('leaveRoom', roomId => {
      socket.leave(roomId);
    });

    socket.on('disconnect', () => {
      console.log('see you later');
    });
  });
};
