import axios from 'axios';
import { URL_RESIDENTS } from '../config/urls';

export const getResidents = async () => {
  try {
    const response = await axios.get(`${URL_RESIDENTS}/`);

    const residents = response.data.residents.map(el => ({
      ...el,
      key: el._id,
    }));

    return { data: residents, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const saveResident = async resident => {
  try {
    const response = await axios.post(`${URL_RESIDENTS}/`, { ...resident });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};
