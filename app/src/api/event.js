import { URL_EVENTS } from '../config/urls';
import { apiClient, createToken } from './axios';
import { getUserInfo } from './user';

export const getEvents = async ({ oldEvents = false } = {}) => {
  try {
    const headers = await createToken();
    const {
      data: { events },
    } = await apiClient.get(`${URL_EVENTS}/`, headers);

    const filteredEvents = events.filter(({ dateOfEvent }) => {
      const eventDate = new Date(dateOfEvent);
      eventDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return oldEvents
        ? eventDate < today && eventDate !== today
        : eventDate >= today;
    });

    return { data: filteredEvents, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const saveEvents = async event => {
  try {
    const headers = await createToken();
    const response = await apiClient.post(
      `${URL_EVENTS}/`,
      {
        ...event,
        createdBy: getUserInfo().id,
      },
      headers
    );

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};
