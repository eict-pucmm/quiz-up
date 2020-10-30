import { URL_RESIDENTS } from '../config/urls';
import { apiClient } from './axios';

export const getResidents = async () => {
  try {
    const response = await apiClient.get(`${URL_RESIDENTS}/`);

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
    const response = await apiClient.post(`${URL_RESIDENTS}/`, { ...resident });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};
