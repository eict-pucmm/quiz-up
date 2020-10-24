export const socketMagic = socketio => {
  socketio.on('connection', socket => {
    console.log('Client connected');

    socket.on('joinRoom', ({ teamName, roomId }) => {
      console.log('teamName', teamName);
      socket.join(roomId);

      socket.to(roomId).emit('welcomeTeam', teamName);

      //listen for question opening
      socket.on('question', ({ question }) => {
        socketio.to(roomId).emit('question', question);
      });

      socket.on('index', index => {
        console.log('index', index);
        socketio.to(roomId).emit('index', index);
      });
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
