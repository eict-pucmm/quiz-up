import { URL_TEAMS } from '../config/urls';
import { apiClient, createToken } from './axios';
import { getUserInfo } from './user';

export const getTeams = async () => {
  try {
    const headers = await createToken();
    const response = await apiClient.get(`${URL_TEAMS}/`, headers);

    return { data: response.data.teams, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const getTeamById = async id => {
  try {
    const headers = await createToken();
    const response = await apiClient.get(`${URL_TEAMS}/${id}`, headers);

    return { data: response.data.team, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const saveTeam = async team => {
  try {
    const headers = await createToken();
    const response = await apiClient.post(
      `${URL_TEAMS}/`,
      { ...team, createdBy: getUserInfo().id },
      headers
    );

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const updateTeam = async (id, team) => {
  try {
    const headers = await createToken();
    const response = await apiClient.put(
      `${URL_TEAMS}/${id}`,
      {
        ...team,
      },
      headers
    );

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};
