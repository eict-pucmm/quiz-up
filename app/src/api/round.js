import axios from 'axios';

import { URL_ROUNDS } from '../config/urls';

export const getRoundsByEvent = async eventId => {
  try {
    const response = await axios.get(`${URL_ROUNDS}/event/${eventId}`);

    return { data: response.data.rounds, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const saveRound = async ({ round, event }) => {
  try {
    const response = await axios.post(`${URL_ROUNDS}/`, { ...round, event });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};
