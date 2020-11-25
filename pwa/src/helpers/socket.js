import io from 'socket.io-client';
let socket;

export const initiateSocket = (roomId, teamName) => {
  socket = io('http://localhost:8080/');
  if (socket && roomId) socket.emit('joinRoom', { teamName, roomId });
};

export const disconnectSocket = () => {
  //TODO: disconnect teams
  // if (socket && roomId) socket.emit('leaveRoom', { roomId, teamName });
  localStorage.removeItem('TEAM');
  if (socket) socket.disconnect();
};

export const subscribeToQuestion = cb => {
  if (!socket) return true;
  socket.on('question', q => {
    return cb(null, q);
  });
};

export const subscribeToTeamInfo = cb => {
  if (!socket) return true;
  socket.on('teamsInfo', teams => {
    return cb(null, teams);
  });
};

export const answerQuestion = (teamInfo, roomId) => {
  if (socket) socket.emit('answer', { teamInfo, roomId });
};
