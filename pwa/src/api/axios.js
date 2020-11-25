import axios from 'axios';
import { auth } from '../helpers/firebase';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/',
});

export const createToken = async () => {
  const user = auth.currentUser;
  const token = user && (await user.getIdToken(true));

  const payloadHeader = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  return payloadHeader;
};
