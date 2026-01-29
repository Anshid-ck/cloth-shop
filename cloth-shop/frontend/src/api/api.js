import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public endpoints
const publicEndpoints = [
  '/api/products/banners',
  '/api/products/category-cards',
  '/api/products/bottom-styles',
  '/api/products/mens-hoodie-grid',
  '/api/products/products',
  '/api/products/categories',
  '/api/products/search',
  '/api/products/colors',
  '/api/products/sizes',
];

const isPublicEndpoint = (url) =>
  publicEndpoints.some(endpoint => url?.includes(endpoint));

// Request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && isPublicEndpoint(originalRequest?.url)) {
      if (localStorage.getItem('access_token') && !originalRequest._retryWithoutAuth) {
        originalRequest._retryWithoutAuth = true;
        delete originalRequest.headers.Authorization;
        return API(originalRequest);
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await API.post('/api/auth/token/refresh/', {
          refresh: refreshToken,
        });

        localStorage.setItem('access_token', response.data.access);
        API.defaults.headers.common.Authorization = `Bearer ${response.data.access}`;

        return API(originalRequest);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default API;
