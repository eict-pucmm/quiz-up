import axios from 'axios';

import { URL_TEAMS } from '../config/urls';

export const getTeamsByMedicalCenter = async medicalCenter => {
  try {
    const response = await axios.get(
      `${URL_TEAMS}/find/mc?center=${encodeURIComponent(medicalCenter)}`
    );

    return { data: response.data.teams, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
