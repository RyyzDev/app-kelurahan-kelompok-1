import api from './api';

// --- ADMIN FOCUSED ---
export const getAllJadwalAdmin = async () => {
  const response = await api.get('/vaksinasi');
  return response.data;
};

export const createJadwal = async (data) => {
  const response = await api.post('/vaksinasi', data);
  return response.data;
};

export const updateJadwal = async (id, data) => {
  const response = await api.patch(`/vaksinasi/${id}`, data);
  return response.data;
};

export const deleteJadwal = async (id) => {
  const response = await api.delete(`/vaksinasi/${id}`);
  return response.data;
};


// --- USER FOCUSED ---
export const getAvailableJadwal = async () => {
  const response = await api.get('/vaksinasi'); // Uses the same public endpoint
  return response.data;
};

export const registerForVaksinasi = async (jadwalId) => {
  const response = await api.post(`/vaksinasi/${jadwalId}/register`);
  return response.data;
};

export const getMyVaksinasi = async () => {
  const response = await api.get('/vaksinasi/my-registrations');
  return response.data;
};

export const getVaksinasiRegistrationById = async (id) => {
  const response = await api.get(`/vaksinasi/my-registrations/${id}`);
  return response.data;
};

export default {
  // Admin
  getAllJadwalAdmin,
  createJadwal,
  updateJadwal,
  deleteJadwal,
  // User
  getAvailableJadwal,
  registerForVaksinasi,
  getMyVaksinasi,
};
