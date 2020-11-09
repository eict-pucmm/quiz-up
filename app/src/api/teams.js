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

export const getTeamById = async id => {
  try {
    const response = await apiClient.get(`${URL_TEAMS}/${id}`);

    return { data: response.data.team, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const saveTeam = async team => {
  try {
    const response = await apiClient.post(`${URL_TEAMS}/`, { ...team });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateTeam = async (id, team) => {
  try {
    const response = await apiClient.put(`${URL_TEAMS}/${id}`, {
      ...team,
    });

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
