import axios from 'axios';
import { getUser } from './user';

export const apiClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + getUser(),
  },
});
