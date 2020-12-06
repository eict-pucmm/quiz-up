export const socketMagic = socketio => {
  // We will keep track of active teams & rooms. Whenever a room is empty, we will
  let roomData = {};
  let clients = 0;

  socketio.on('connection', socket => {
    console.log('Client connected');
    console.log('On connection Started', roomData);
    clients++;
    console.log('Clients', clients);

    socket.on('joinRoom', ({ teamName, roomId }) => {
      socket.join(roomId);

      if (roomId) {
        const teamData = {
          name: teamName,
          socketId: socket.id,
        };

        if (!roomData[roomId]) {
          // Enable this room with the team
          roomData[roomId] = {
            teams: [teamData],
          };
        } else {
          // Add the team to the room
          roomData[roomId].teams = [...roomData[roomId].teams, teamData];
        }
      }

      console.log('On Join Room', roomData[roomId]);

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

      socket.on('apaga', ({ status }) => {
        socketio.to(roomId).emit('vamonos', { status });
      });

      //start/stop timer
      let timer;
      socket.on(`countdown-${roomId}`, payload => {
        if (roomId !== payload.roomId) return;
        const counting = payload.status;
        let countdown = counting ? payload.amount || 15 : 0;
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
      // Check rooms with no teams and clear them up:
      Object.keys(roomData).forEach(roomId => {
        // Look for disconnected team:
        if (!roomData[roomId]) {
          return;
        }

        const teamThatLeft = roomData[roomId].teams.find(
          team => team.socketId === socket.id
        );

        if (teamThatLeft) {
          console.log(teamThatLeft);
          // Emit to the room that the team has left;
          socketio.to(roomId).emit('byeTeam', teamThatLeft.name);
          // Ideally, report that to the DB :shrug:
          // Remove the team from our list:
          roomData[roomId].teams = roomData[roomId].teams.filter(
            team => team.socketId !== socket.id
          );
        } else {
          // This team wasn't in that room.
        }

        if (roomData[roomId].teams.length === 0) {
          roomData[roomId] = undefined;
        }
      });

      clients--;
      console.log('Clients', clients);
      console.log('see you later');
    });
  });
};
