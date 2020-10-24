import io from 'socket.io-client';
let socket;

export const initiateSocket = roomId => {
  socket = io('/');
  if (socket && roomId) socket.emit('joinRoom', { teamName: 'ADMIN', roomId });
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const subscribeToTeams = cb => {
  if (!socket) return cb(true, null);
  socket.on('welcomeTeam', team => cb(null, team));
};

/**
 * @param {name: String, index: number} payload
 */
export const sendQuestionToServer = payload => {
  if (socket) socket.emit('question', payload);
};

export const sendQuestionIndex = index => {
  console.log('index', index);
  if (socket) socket.emit('index', index);
};

export const subscribeToAnswers = cb => {
  if (!socket) return cb(true, null);
  socket.on('answer', answer => cb(null, answer));
};

export const subscribeToQuestionIndex = cb => {
  if (!socket) return cb(true, null);
  socket.on('index', index => cb(null, index));
};
