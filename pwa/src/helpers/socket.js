import io from 'socket.io-client';
let socket;

export const initiateSocket = (roomId, teamName) => {
  socket = io('http://localhost:8080/');
  if (socket && roomId) socket.emit('joinRoom', { teamName, roomId });
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
  localStorage.removeItem('TEAM');
};

export const subscribeToQuestion = cb => {
  if (!socket) return true;
  socket.on('question', q => {
    return cb(null, q);
  });
};

export const answerQuestion = (teamInfo, roomId) => {
  if (socket) socket.emit('answer', { teamInfo, roomId });
};
