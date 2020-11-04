import { URL_ADMINS } from '../config/urls';
import { apiClient } from './axios';

export const getAdmins = async () => {
  try {
    const response = await apiClient.get(`${URL_ADMINS}/`);

    return { data: response.data.admins, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getAdminById = async id => {
  try {
    const response = await apiClient.get(`${URL_ADMINS}/${id}`);

    return { data: response.data.admin, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const saveAdmin = async admin => {
  try {
    const response = await apiClient.post(`${URL_ADMINS}/`, { ...admin });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const removeAdmin = async id => {
  try {
    const response = await apiClient.put(`${URL_ADMINS}/${id}`, {
      deleted: true,
      deletedAt: new Date(),
    });

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
