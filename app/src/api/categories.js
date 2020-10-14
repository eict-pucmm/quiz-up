import axios from 'axios';

import { URL_CATEGORIES } from '../config/urls';

export const getCategories = async () => {
  try {
    const response = await axios.get(`${URL_CATEGORIES}/`);

    return { data: response.data.categories, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
