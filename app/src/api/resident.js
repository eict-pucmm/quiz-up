import { URL_RESIDENTS } from '../config/urls';
import { apiClient } from './axios';
import { getUserInfo } from './user';

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

export const getResidentById = async id => {
  try {
    const response = await apiClient.get(`${URL_RESIDENTS}/${id}`);

    return { data: response.data.resident, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const saveResident = async resident => {
  try {
    const response = await apiClient.post(`${URL_RESIDENTS}/`, {
      ...resident,
      createdBy: getUserInfo().id,
    });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const updateResident = async (id, resident) => {
  try {
    const res = await apiClient.put(`${URL_RESIDENTS}/${id}`, { ...resident });

    return { data: res, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
