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

export const getTeamByRoomIdAndTeamName = async (room, teamName) => {
  try {
    const headers = await createToken();
    const response = await apiClient.get(
      `${URL_TEAMS}/round/${room}/team/${encodeURIComponent(teamName)}`,
      headers
    );

    return { data: response.data.teamInfo, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const findTeamBelongsToRound = async (teamName, room) => {
  try {
    const headers = await createToken();
    const response = await apiClient.get(
      `${URL_TEAMS}/team/${encodeURIComponent(teamName)}/round/${room}`,
      headers
    );
    return { data: response.data.data, error: null };
  } catch (error) {
    return { data: false, error };
  }
};
