import api from './api';

export const createAspirasi = async (data) => {
  const response = await api.post('/aspirasi', data);
  return response.data;
};

export const getAllAspirasi = async () => {
  const response = await api.get('/aspirasi');
  return response.data;
};

export default {
  createAspirasi,
  getAllAspirasi
};
