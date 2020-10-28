import axios from 'axios';

import { URL_MEDICAL_CENTERS } from '../config/urls';

export const getMedicalCenters = async () => {
  try {
    const response = await axios.get(`${URL_MEDICAL_CENTERS}/`);

    return { data: response.data.medicalCenters, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
