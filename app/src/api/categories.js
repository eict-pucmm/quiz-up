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

export const getCategoryById = async id => {
  try {
    const response = await apiClient.get(`${URL_CATEGORIES}/${id}`);

    return { data: response.data.category, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const saveCategory = async category => {
  try {
    const response = await apiClient.post(`${URL_CATEGORIES}/`, {
      ...category,
    });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateCategory = async (id, category) => {
  try {
    const response = await apiClient.put(`${URL_CATEGORIES}/${id}`, {
      ...category,
    });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const removeCategory = async id => {
  try {
    const response = await apiClient.put(`${URL_CATEGORIES}/${id}`, {
      deleted: true,
      deletedAt: new Date(),
    });

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
