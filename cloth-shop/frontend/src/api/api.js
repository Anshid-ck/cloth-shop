import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public endpoints that should not trigger login redirects
const publicEndpoints = [
  '/products/banners',
  '/products/category-cards',
  '/products/bottom-styles',
  '/products/mens-hoodie-grid',
  '/products/products',
  '/products/categories',
  '/products/search',
  '/products/colors',
  '/products/sizes',
];

// Check if URL is a public endpoint
const isPublicEndpoint = (url) => {
  return publicEndpoints.some(endpoint => url?.includes(endpoint));
};

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

    // Don't redirect for public endpoints - just return the error
    if (error.response?.status === 401 && isPublicEndpoint(originalRequest?.url)) {
      // For public endpoints, clear invalid token and retry without auth
      const token = localStorage.getItem('access_token');
      if (token && !originalRequest._retryWithoutAuth) {
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
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/token/refresh/`,
          { refresh: refreshToken }
        );

        localStorage.setItem('access_token', response.data.access);
        API.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

        return API(originalRequest);
      } catch (err) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Only redirect if not already on login or public pages
        if (!window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/register') &&
          window.location.pathname !== '/') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default API;