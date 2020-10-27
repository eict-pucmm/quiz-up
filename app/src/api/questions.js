import axios from 'axios';

import { URL_QUESTIONS } from '../config/urls';

export const getQuestions = async () => {
  try {
    const response = await axios.get(`${URL_QUESTIONS}/`);

    return { data: response.data.questions, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const saveQuestion = async question => {
  try {
    const response = await axios.post(`${URL_QUESTIONS}/`, { ...question });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const removeQuestion = async id => {
  try {
    const response = await axios.put(`${URL_QUESTIONS}/${id}`, {
      deleted: true,
      deletedAt: new Date(),
    });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
