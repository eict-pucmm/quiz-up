import axios from 'axios';

import { URL_EVENTS } from '../config/urls';

export const getEvents = async ({ oldEvents = false } = {}) => {
  try {
    const {
      data: { events },
    } = await axios.get(`${URL_EVENTS}/`);

    const filteredEvents = events.filter(({ dateOfEvent }) => {
      const eventDate = new Date(dateOfEvent).toDateString();
      const today = new Date().toDateString();

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
    const response = await axios.post(`${URL_EVENTS}/`, { ...event });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};
