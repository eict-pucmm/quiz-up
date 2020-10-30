import { URL_TEAMS } from '../config/urls';
import { apiClient } from './axios';

export const getTeams = async () => {
  try {
    const response = await apiClient.get(`${URL_TEAMS}/`);

    return { data: response.data.teams, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
