import { apiClient } from './axios';

import { URL_QUESTIONS } from '../config/urls';
import { getUserInfo } from './user';

export const getQuestions = async () => {
  try {
    const response = await apiClient.get(`${URL_QUESTIONS}/`);

    return { data: response.data.questions, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getQuestionById = async id => {
  try {
    const response = await apiClient.get(`${URL_QUESTIONS}/${id}`);

    return { data: response.data.question, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const saveQuestion = async question => {
  try {
    const response = await apiClient.post(`${URL_QUESTIONS}/`, {
      ...question,
      createdBy: getUserInfo().id,
    });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateQuestion = async (id, question) => {
  try {
    const response = await apiClient.put(`${URL_QUESTIONS}/${id}`, {
      ...question,
    });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const removeQuestion = async id => {
  try {
    const response = await apiClient.put(`${URL_QUESTIONS}/${id}`, {
      deleted: true,
      deletedAt: new Date(),
    });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
