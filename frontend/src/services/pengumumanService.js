import api from './api';

export const getAllPengumuman = async () => {
  const response = await api.get('/pengumuman');
  return response.data;
};

export const createPengumuman = async (data) => {
  const response = await api.post('/pengumuman', data);
  return response.data;
};

export const deletePengumuman = async (id) => {
  const response = await api.delete(`/pengumuman/${id}`);
  return response.data;
};

export default {
  getAllPengumuman,
  createPengumuman,
  deletePengumuman
};
