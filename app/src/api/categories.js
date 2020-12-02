import { URL_CATEGORIES } from '../config/urls';
import { apiClient, createToken } from './axios';
import { getUserInfo } from './user';

export const getCategories = async () => {
  try {
    const headers = await createToken();
    const response = await apiClient.get(`${URL_CATEGORIES}/`, headers);

    return { data: response.data.categories, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const getCategoryById = async id => {
  try {
    const headers = await createToken();
    const response = await apiClient.get(`${URL_CATEGORIES}/${id}`, headers);

    return { data: response.data.category, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const saveCategory = async category => {
  try {
    const headers = await createToken();
    const response = await apiClient.post(
      `${URL_CATEGORIES}/`,
      {
        ...category,
        createdBy: getUserInfo().id,
      },
      headers
    );

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const updateCategory = async (id, category) => {
  try {
    const headers = await createToken();
    const response = await apiClient.put(
      `${URL_CATEGORIES}/${id}`,
      {
        ...category,
      },
      headers
    );

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const removeCategory = async id => {
  try {
    const headers = await createToken();
    const response = await apiClient.put(
      `${URL_CATEGORIES}/${id}`,
      {
        deleted: true,
        deletedAt: new Date(),
      },
      headers
    );

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};
