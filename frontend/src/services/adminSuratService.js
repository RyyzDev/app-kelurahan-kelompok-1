import api from './api';

export const getAllPermohonan = async (status = '') => {
  const response = await api.get(`/admin/permohonan${status ? `?status=${status}` : ''}`);
  return response.data;
};

export const verifyPermohonan = async (id, data) => {
  // data: { action: 'approve' | 'reject', catatan_admin?: string }
  const response = await api.patch(`/admin/permohonan/${id}/verify`, data);
  return response.data;
};

export const signPermohonan = async (id, data) => {
  // data: { nomor_surat: string, file_url?: string }
  const response = await api.patch(`/admin/permohonan/${id}/sign`, data);
  return response.data;
};

export const updateProgressRT_RW = async (id, data) => {
  // data: { role_signer: 'rt' | 'rw' }
  const response = await api.patch(`/admin/permohonan/${id}/progress-rt-rw`, data);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard/stats');
  return response.data;
};

export const getVaksinAntrianList = async () => {
  const response = await api.get('/admin/antrian/vaksin');
  return response.data;
};

export const getVaksinAntrianDetail = async (id) => {
  const response = await api.get(`/admin/antrian/vaksin/${id}`);
  return response.data;
};

export const updateVaksinAntrianStatus = async (id, status) => {
  const response = await api.patch(`/admin/antrian/vaksin/${id}/status`, { status });
  return response.data;
};

export const getEventAntrianList = async () => {
  const response = await api.get('/admin/antrian/event');
  return response.data;
};

export const getEventAntrianDetail = async (id) => {
  const response = await api.get(`/admin/antrian/event/${id}`);
  return response.data;
};
