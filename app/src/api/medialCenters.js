import { URL_MEDICAL_CENTERS } from '../config/urls';
import { apiClient } from './axios';

export const getMedicalCenters = async () => {
  try {
    const response = await apiClient.get(`${URL_MEDICAL_CENTERS}/`);

    return { data: response.data.medicalCenters, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
