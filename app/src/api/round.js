import axios from 'axios';

import { URL_ROUNDS, URL_EVENTS } from '../config/urls';

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
    //update the parent event to add the round to
    //the array of rounds of a specific event
    await axios.put(`${URL_EVENTS}/${event}`, { rounds: [response.data._id] });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};
