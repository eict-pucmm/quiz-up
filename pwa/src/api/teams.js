import { URL_TEAMS } from '../config/urls';
import { apiClient, createToken } from './axios';

export const getTeamsByMedicalCenter = async medicalCenter => {
  try {
    const headers = await createToken();
    const response = await apiClient.get(
      `${URL_TEAMS}/find/mc?center=${encodeURIComponent(medicalCenter)}`,
      headers
    );

    return { data: response.data.teams, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};
