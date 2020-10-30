import { URL_ROUNDS, URL_EVENTS } from '../config/urls';
import { apiClient } from './axios';

export const getRoundsByEvent = async eventId => {
  try {
    const response = await apiClient.get(`${URL_ROUNDS}/event/${eventId}`);

    return { data: response.data.rounds, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getRoundById = async roundId => {
  try {
    const response = await apiClient.get(`${URL_ROUNDS}/${roundId}`);

    return { data: response.data.round, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const saveRound = async ({ round, event }) => {
  try {
    const response = await apiClient.post(`${URL_ROUNDS}/`, {
      ...round,
      event,
    });
    //update the parent event to add the round to
    //the array of rounds of a specific event
    await apiClient.put(`${URL_EVENTS}/${event}`, {
      rounds: [response.data._id],
    });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};
