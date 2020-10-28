import { URL_CATEGORIES } from '../config/urls';
import { apiClient } from './axios';

export const getCategories = async () => {
  try {
    const response = await apiClient.get(`${URL_CATEGORIES}/`);

    return { data: response.data.categories, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
