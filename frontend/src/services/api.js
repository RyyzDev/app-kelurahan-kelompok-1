import axios from 'axios';

const api = axios.create({
  baseURL: 'https://churchy-unpacifistic-velva.ngrok-free.dev/api' || 'http://localhost:5000/api',
  timeout: 10000,
});

// Attach JWT token otomatis dan bypass ngrok warning
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  // Tambahkan header bypass ngrok
  config.headers['ngrok-skip-browser-warning'] = 'true';
  
  return config;
});

// Handle 401 → redirect ke login jika bukan di halaman login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
