import { URL_ROUNDS, URL_EVENTS } from '../config/urls';
import { apiClient, createToken } from './axios';
import { getUserInfo } from './user';

export const getRoundsByEvent = async eventId => {
  try {
    const headers = await createToken();
    const response = await apiClient.get(
      `${URL_ROUNDS}/event/${eventId}`,
      headers
    );

    return { data: response.data.rounds, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const getRoundById = async roundId => {
  try {
    const headers = await createToken();
    const response = await apiClient.get(`${URL_ROUNDS}/${roundId}`, headers);

    return { data: response.data.round, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const saveRound = async ({ round, event }) => {
  try {
    const headers = await createToken();
    const response = await apiClient.post(
      `${URL_ROUNDS}/`,
      {
        ...round,
        event,
        createdBy: getUserInfo().id,
      },
      headers
    );
    //update the parent event to add the round to
    //the array of rounds of a specific event
    await apiClient.put(
      `${URL_EVENTS}/${event}`,
      {
        rounds: [response.data._id],
      },
      headers
    );

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const updateRound = async (id, round) => {
  try {
    const headers = await createToken();
    const response = await apiClient.put(
      `${URL_ROUNDS}/${id}`,
      {
        ...round,
      },
      headers
    );

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const removeRound = async id => {
  try {
    const headers = await createToken();
    const response = await apiClient.put(
      `${URL_ROUNDS}/${id}`,
      {
        deleted: true,
        deletedAt: new Date(),
      },
      headers
    );
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};
