import firebase from 'firebase-admin';
import { FORBIDDEN, UNAUTHORIZED } from '../../config/statusCodes';

firebase.initializeApp({
  credentials: firebase.credential.applicationDefault(),
  databaseURL: 'https://quizup-c36c7.firebaseio.com',
});

const authMiddleware = (request, response, next) => {
  const headerToken = request.headers.authorization;
  if (!headerToken) {
    return response.send({ message: 'No token provided' }).status(UNAUTHORIZED);
  }

  if (headerToken && headerToken.split(' ')[0] !== 'Bearer') {
    response.send({ message: 'Invalid token' }).status(UNAUTHORIZED);
  }

  const token = headerToken.split(' ')[1];
  firebase
    .auth()
    .verifyIdToken(token)
    .then(() => next())
    .catch(() => {
      response.send({ message: 'Could not authorize' }).status(FORBIDDEN);
    });
};

export default authMiddleware;
