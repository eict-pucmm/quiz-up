import axios from 'axios';

import { URL_EVENTS } from '../config/urls';

export const getEvents = async () => {
  try {
    const response = await axios.get(`${URL_EVENTS}/`);

    return { data: response.data.events, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const saveEvents = async event => {
  try {
    const response = await axios.post(`${URL_EVENTS}/`, { ...event });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};
