import api from './api';

export const getProfile = async () => {
  const response = await api.get('/user/profile');
  return response.data;
};

export const updateProfile = async (data) => {
  if (!navigator.onLine) {
    await queueOfflineRequest('update_profile', data);
    return { success: true, offline: true, message: 'Pembaruan profil dijadwalkan saat online.' };
  }
  const response = await api.patch('/user/profile', data);
  return response.data;
};

export const changePassword = async (data) => {
  if (!navigator.onLine) {
    await queueOfflineRequest('change_password', data);
    return { success: true, offline: true, message: 'Ganti kata sandi dijadwalkan saat online.' };
  }
  const response = await api.put('/user/change-password', data);
  return response.data;
};

// Admin Services
export const adminGetAllUsers = async (params = {}) => {
  // params: { role, search }
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const adminGetUserDetail = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};
