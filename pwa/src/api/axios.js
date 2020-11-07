import axios from 'axios';
import { getUser } from './user';

export const apiClient = axios.create({
  baseURL: 'https://quizup-api-pucmm.site/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + getUser(),
  },
});
