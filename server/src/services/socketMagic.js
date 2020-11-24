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

      socket.on('subscribeToIndexDesktop', ({ index, open }) => {
        console.log('toDesktop', { index, open });
        socketio.to(roomId).emit('indexDesktop', { index, open });
      });

      socket.on('subscribeToIndexMobile', ({ index, open }) => {
        console.log('toMobile', { index, open });
        socketio.to(roomId).emit('indexMobile', { index, open });
      });
    });

    //start/stop timer
    let timer;
    socket.on('countdown', ({ roomId, status }) => {
      const counting = status;
      let countdown = counting ? 15 : 0;
      const STOP = !counting || countdown <= 0;

      if (STOP) {
        clearInterval(timer);
        return;
      } else {
        timer = setInterval(() => {
          countdown--;

          console.log('👀 sending stuff');
          socketio
            .to(roomId)
            .emit('timer', { timer: countdown, open: counting });
        }, 1000);
      }
    });

    socket.on('answer', ({ teamInfo, roomId }) => {
      console.log('{ teamInfo, roomId }', { teamInfo, roomId });
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
