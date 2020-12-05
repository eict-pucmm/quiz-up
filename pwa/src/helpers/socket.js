import io from 'socket.io-client';
let socket;

let rID;
export const initiateSocket = (roomId, teamName) => {
  socket = io(process.env.REACT_APP_QU_BASE_API);
  // socket = io(process.env.REACT_APP_QU_LOCAL_API);
  rID = roomId;
  if (socket && roomId) socket.emit('joinRoom', { teamName, roomId });
};

export const disconnectSocket = () => {
  //TODO: disconnect teams
  if (socket && rID) socket.emit('leaveRoom', { roomId: rID });
  localStorage.removeItem('TEAM');
  // if (socket) socket.disconnect();
};

export const subscribeToQuestion = cb => {
  if (!socket) return true;
  socket.on('question', q => {
    return cb(null, q);
  });
};

export const subscribeToVamonos = cb => {
  if (!socket) return true;
  socket.on('vamonos', status => {
    //if true apaga y vamonos
    return cb(null, status);
  });
};

export const subscribeToRightOrWrongAnswer = cb => {
  if (!socket) return true;
  socket.on('answersDesktop', ({ team, points, action }) => {
    return cb(null, { team, points, action });
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
