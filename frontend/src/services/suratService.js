import api from './api';
import { queueOfflineRequest } from '../utils/offlineQueue';

const CACHE_NAME = 'sigercap-manual-cache-v1';
const LAYANAN_URL = '/warga/surat/layanan';

export const getJenisSurat = async () => {
  try {
    // 1. Coba fetch dari network
    const response = await api.get(LAYANAN_URL);
    
    // 2. Simpan ke Cache Storage secara manual untuk backup offline
    if (window.caches) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(LAYANAN_URL, new Response(JSON.stringify(response.data)));
    }
    
    return response.data;
  } catch (err) {
    // 3. Jika offline/gagal, coba ambil dari Cache Storage
    if (window.caches) {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(LAYANAN_URL);
      if (cachedResponse) {
        console.log('Serving letter services from manual cache (offline mode)');
        return await cachedResponse.json();
      }
    }
    throw err;
  }
};

export const createPermohonanSurat = async (data) => {
  if (!navigator.onLine) {
    await queueOfflineRequest('permohonan_surat', data);
    return { success: true, offline: true, message: 'Permohonan disimpan dalam antrean offline.' };
  }
  const response = await api.post('/warga/surat/permohonan', data);
  return response.data;
};

export const getMyPermohonanSurat = async () => {
  const response = await api.get('/warga/surat/permohonan');
  return response.data;
};

export const getPermohonanSuratDetail = async (id) => {
  const response = await api.get(`/warga/surat/permohonan/${id}`);
  return response.data;
};
