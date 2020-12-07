/* eslint-disable require-atomic-updates */
import uniqBy from 'lodash/uniqBy';

import Round from '../rest/components/round/model';
import wrapper from '../rest/utils/async';

const fetchRoom = async roomId => {
  const [errorRoom, room] = await wrapper(
    Round.findOne({ roomId: roomId }).populate([
      {
        path: 'questions.question',
        select: 'name points',
      },
      {
        path: 'participants.failed',
        select: 'points',
      },
      {
        path: 'participants.answered',
        select: 'points',
      },
      {
        path: 'participants.team',
        select: 'name',
      },
      // {
      //   path: 'bonusQuestion',
      //   select: 'name',
      // },
    ])
  );

  if (errorRoom) {
    return null;
  }

  return room;
};

export const socketMagic = socketio => {
  // We will keep track of active teams & rooms. Whenever a room is empty, we will
  let roomData = {};
  let clients = 0;

  socketio.on('connection', socket => {
    console.log('Client connected');
    console.log('On connection Started', roomData);
    clients++;
    console.log('Clients', clients);

    socket.on('joinRoom', async ({ teamName, roomId }) => {
      if (!roomData[roomId]) {
        // For the first person that enters the room we load the entire room.
        const room = await fetchRoom(roomId);

        if (!room) {
          return; // Something happened, don't do anything else.
        }

        roomData[roomId] = {
          room,
          teams: [],
        };
      }

      socket.join(roomId);

      if (roomId) {
        const teamData = {
          name: teamName,
          socketId: socket.id,
        };

        // Add the team to the room
        roomData[roomId].teams = uniqBy(
          [teamData, ...roomData[roomId].teams],
          'socketId'
        );

        const updateDB = roomData[roomId].room.participants.find(
          participant => participant.team.name === teamName
        );

        if (updateDB) {
          console.log('Updating Room, ', roomId);

          roomData[roomId].room = await fetchRoom(roomId);

          console.log(
            'participants pre-update',
            roomData[roomId].room.participants,
            teamName
          );

          roomData[roomId].room.participants = roomData[
            roomId
          ].room.participants.map(participant => {
            if (participant.team.name === teamName) {
              participant.connected = true;
            }

            return participant;
          });

          console.log(
            'participants input',
            roomData[roomId].room.participants,
            teamName
          );

          await wrapper(
            Round.findByIdAndUpdate(
              { _id: roomData[roomId].room._id },
              { participants: roomData[roomId].room.participants },
              { new: true }
            )
          );

          roomData[roomId].room = await fetchRoom(roomId);

          console.log(
            'participants post-update',
            roomData[roomId].room.participants,
            teamName
          );
          console.log('Room Updated, ', roomId);
        }

        // Update this team as logged in:

        console.log(roomData[roomId].room.participants);

        const withTotalPoints = roomData[roomId].room.participants.map(
          values => {
            const { answered, failed, connected, _id, team } = values;
            const temp = { connected, _id, team, answered, failed };
            const sumFunc = (total, num) => total + num.points;
            const pointsGained = answered.reduce(sumFunc, 0);
            const pointsLosed = failed.reduce(sumFunc, 0);

            return { ...temp, total: pointsGained - pointsLosed };
          }
        );

        socket.to(roomId).emit('teamsInfo', withTotalPoints);
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

    socket.on('disconnect', async () => {
      // Check rooms with no teams and clear them up:
      Object.keys(roomData).forEach(async roomId => {
        // Look for disconnected team:
        if (!roomData[roomId]) {
          return;
        }

        const teamThatLeft = roomData[roomId].teams.find(
          team => team.socketId === socket.id
        );

        if (teamThatLeft) {
          console.log(teamThatLeft);
          // Emit to the room that the team has left, but first
          // Check that no other teams with that name are in the room:
          const totalTeamsThatLeft = roomData[roomId].teams.filter(
            team => team.name === teamThatLeft.name
          );

          // If we detect no duplicates of this team, we report it has left
          if (totalTeamsThatLeft.length <= 1) {
            const updateDB = roomData[roomId].room.participants.find(
              participant => participant.team.name === teamThatLeft.name
            );

            if (updateDB) {
              console.log('Updating Room, ', roomId);
              roomData[roomId].room = await fetchRoom(roomId);

              // Update this team as logged out:
              roomData[roomId].room.participants = roomData[
                roomId
              ].room.participants.map(participant => {
                if (participant.team.name === teamThatLeft.name) {
                  participant.connected = false;
                }

                return participant;
              });

              await wrapper(
                Round.findByIdAndUpdate(
                  { _id: roomData[roomId].room._id },
                  { participants: roomData[roomId].room.participants },
                  { new: true }
                )
              );

              console.log('Room Updated, ', roomId);

              roomData[roomId].room = await fetchRoom(roomId);

              const withTotalPoints = roomData[roomId].room.participants.map(
                values => {
                  const { answered, failed, connected, _id, team } = values;
                  const temp = { connected, _id, team, answered, failed };
                  const sumFunc = (total, num) => total + num.points;
                  const pointsGained = answered.reduce(sumFunc, 0);
                  const pointsLosed = failed.reduce(sumFunc, 0);

                  return { ...temp, total: pointsGained - pointsLosed };
                }
              );

              socket.to(roomId).emit('teamsInfo', withTotalPoints);
            }

            socketio.to(roomId).emit('byeTeam', teamThatLeft.name);
          }
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
