import api from './api';
import { queueOfflineRequest } from '../utils/offlineQueue';

const CACHE_NAME = 'sigercap-umkm-cache-v1';
const PRODUK_URL = '/umkm/produk';

/**
 * Helper to convert object to FormData for multipart/form-data requests
 */
const toFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });
  return formData;
};

export const getMyToko = async () => {
  const response = await api.get('/umkm/toko/my');
  return response.data;
};

export const registerToko = async (data) => {
  const response = await api.post('/umkm/toko', data);
  return response.data;
};

export const addProduk = async (data) => {
  if (!navigator.onLine) {
    await queueOfflineRequest('add_produk', data);
    return { success: true, offline: true, message: 'Produk akan diupload saat online.' };
  }
  // Data contains the 'foto' file
  const formData = toFormData(data);
  const response = await api.post('/umkm/produk', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const updateProduk = async (id, data) => {
  if (!navigator.onLine) {
    await queueOfflineRequest('update_produk', { ...data, id });
    return { success: true, offline: true, message: 'Update produk dijadwalkan saat online.' };
  }
  // Data might contain the 'foto' file
  const formData = toFormData(data);
  const response = await api.patch(`/umkm/produk/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteProduk = async (id) => {
  if (!navigator.onLine) {
    await queueOfflineRequest('delete_produk', { id });
    return { success: true, offline: true, message: 'Penghapusan dijadwalkan saat online.' };
  }
  const response = await api.delete(`/umkm/produk/${id}`);
  return response.data;
};

export const getPublicProduk = async (kategori = '') => {
  const url = `${PRODUK_URL}${kategori ? `?kategori=${kategori}` : ''}`;
  try {
    const response = await api.get(url);
    
    // Simpan ke Cache secara manual
    if (window.caches) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(url, new Response(JSON.stringify(response.data)));
    }
    
    return response.data;
  } catch (err) {
    // Fallback ke cache jika offline
    if (window.caches) {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(url);
      if (cachedResponse) {
        console.log('Serving UMKM products from manual cache');
        return await cachedResponse.json();
      }
    }
    throw err;
  }
};

export const getPendingProduk = async () => {
  const response = await api.get('/umkm/admin/pending');
  return response.data;
};

export const verifyProduk = async (id, data) => {
  const response = await api.patch(`/umkm/admin/verify/${id}`, data);
  return response.data;
};

export const getPublicTokoById = async (id) => {
  const response = await api.get(`/umkm/toko/${id}`);
  return response.data;
};

export const getMyTokoDashboard = async () => {
  const response = await api.get('/umkm/toko/my/dashboard');
  return response.data;
};
