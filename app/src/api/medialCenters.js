import { URL_MEDICAL_CENTERS } from '../config/urls';
import { apiClient, createToken } from './axios';
import { getUserInfo } from './user';

export const getMedicalCenters = async () => {
  try {
    const headers = await createToken();
    const response = await apiClient.get(`${URL_MEDICAL_CENTERS}/`, headers);

    return { data: response.data.medicalCenters, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const getMedicalCenterById = async id => {
  try {
    const headers = await createToken();
    const response = await apiClient.get(
      `${URL_MEDICAL_CENTERS}/${id}`,
      headers
    );

    return { data: response.data.medicalCenter, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const saveMedicalCenter = async center => {
  try {
    const headers = await createToken();
    const response = await apiClient.post(
      `${URL_MEDICAL_CENTERS}/`,
      {
        ...center,
        createdBy: getUserInfo().id,
      },
      headers
    );

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const updateMedicalCenter = async (id, center) => {
  try {
    const headers = await createToken();
    const response = await apiClient.put(
      `${URL_MEDICAL_CENTERS}/${id}`,
      {
        ...center,
      },
      headers
    );

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};

export const removeMedicalCenter = async id => {
  try {
    const headers = await createToken();
    const response = await apiClient.put(
      `${URL_MEDICAL_CENTERS}/${id}`,
      {
        deleted: true,
        deletedAt: new Date(),
      },
      headers
    );

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response };
  }
};
