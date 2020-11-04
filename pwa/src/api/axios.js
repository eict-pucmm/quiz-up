import axios from 'axios';
import { getUser } from './user';

export const apiClient = axios.create({
  baseURL: 'http://3.20.168.127:8080/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + getUser(),
  },
});
