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
        socketio.to(roomId).emit('indexDesktop', { index, open });
      });

      socket.on('subscribeToIndexMobile', ({ index, open }) => {
        socketio.to(roomId).emit('indexMobile', { index, open });
      });

      socket.on('subscribeToAnswersDesktop', ({ team, points, action }) => {
        socketio.to(roomId).emit('answersDesktop', { team, points, action });
      });

      //start/stop timer
      let timer;
      socket.on(`countdown-${roomId}`, payload => {
        if (roomId !== payload.roomId) return;
        const counting = payload.status;
        let countdown = counting ? 15 : 0;
        const STOP = !counting || countdown <= 0;

        if (STOP) {
          // console.log('before clear interval', timer);
          clearInterval(timer);
          return;
        } else {
          // console.log('emitting timer');
          timer = setInterval(() => {
            countdown--;
            // console.log('sending stuff');
            socketio
              .to(roomId)
              .emit('timer', { timer: countdown, open: counting });
            if (countdown <= 0) {
              clearInterval(timer);
            }
          }, 1000);
        }
      });
    });

    socket.on('answer', ({ teamInfo, roomId }) => {
      socketio.to(roomId).emit('answer', teamInfo);
    });

    socket.on('leaveRoom', ({ roomId, teamName }) => {
      if (teamName) socketio.to(roomId).emit('byeTeam', teamName);
      socket.leave(roomId);
    });

    socket.on('disconnect', () => {
      console.log('see you later');
    });
  });
};
