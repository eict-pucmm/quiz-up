import { URL_EVENTS } from '../config/urls';
import { apiClient } from './axios';

export const getEvents = async ({ oldEvents = false } = {}) => {
  try {
    const {
      data: { events },
    } = await apiClient.get(`${URL_EVENTS}/`);

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
    const response = await apiClient.post(`${URL_EVENTS}/`, { ...event });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};
