import { URL_MEDICAL_CENTERS } from '../config/urls';
import { apiClient, createToken } from './axios';

export const getMedicalCenters = async () => {
  try {
    const headers = await createToken();
    const response = await apiClient.get(`${URL_MEDICAL_CENTERS}/`, headers);

    return { data: response.data.medicalCenters, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};
