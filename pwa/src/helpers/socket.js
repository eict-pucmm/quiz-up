import io from 'socket.io-client';
let socket;

export const initiateSocket = (roomId, teamName) => {
  socket = io('https://quizup-api-pucmm.site/');
  if (socket && roomId) socket.emit('joinRoom', { teamName, roomId });
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
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
