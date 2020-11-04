import { URL_TEAMS } from '../config/urls';
import { apiClient } from './axios';

export const getTeamsByMedicalCenter = async medicalCenter => {
  try {
    const response = await apiClient.get(
      `${URL_TEAMS}/find/mc?center=${encodeURIComponent(medicalCenter)}`
    );

    return { data: response.data.teams, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
