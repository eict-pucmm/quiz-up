import axios from 'axios';

import { URL_EVENTS } from '../config/urls';

export const getEvents = async ({ oldEvents = false } = {}) => {
  try {
    const { data } = await axios.get(`${URL_EVENTS}/`);
    console.log('getEvents -> data', data);

    const filteredEvents = data.events.filter(({ dateOfEvent }) => {
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
    const response = await axios.post(`${URL_EVENTS}/`, { ...event });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};
