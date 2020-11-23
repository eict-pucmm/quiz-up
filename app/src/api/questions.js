import { apiClient, createToken } from './axios';

import { URL_QUESTIONS } from '../config/urls';
import { getUserInfo } from './user';

export const getQuestions = async () => {
  try {
    const headers = await createToken();
    const response = await apiClient.get(`${URL_QUESTIONS}/`, headers);

    return { data: response.data.questions, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const getQuestionById = async id => {
  try {
    const headers = await createToken();
    const response = await apiClient.get(`${URL_QUESTIONS}/${id}`, headers);

    return { data: response.data.question, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const saveQuestion = async question => {
  try {
    const headers = await createToken();
    const response = await apiClient.post(
      `${URL_QUESTIONS}/`,
      {
        ...question,
        createdBy: getUserInfo().id,
      },
      headers
    );

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const updateQuestion = async (id, question) => {
  try {
    const headers = await createToken();
    const response = await apiClient.put(
      `${URL_QUESTIONS}/${id}`,
      {
        ...question,
      },
      headers
    );

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const removeQuestion = async id => {
  try {
    const headers = await createToken();
    const response = await apiClient.put(
      `${URL_QUESTIONS}/${id}`,
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
