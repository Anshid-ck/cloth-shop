import API from './api';

export const authAPI = {
  register: (data) => API.post('/auth/register/', data),
  verifyEmail: (data) => API.post('/auth/verify-email/', data),

  // Login and Logout
  login: (data) => API.post('/auth/login/', data),
  googleLogin: (token) => API.post('/auth/google-login/', { token }),
  adminLogin: (data) => API.post('/auth/admin-login/', data),
  logout: () => API.post('/auth/logout/'),

  // Password Management
  changePassword: (data) => API.post('/auth/change-password/', data),
  forgotPassword: (data) => API.post('/auth/forgot-password/', data),
  resetPassword: (data) => API.post('/auth/reset-password/', data),

  // Profile
  getProfile: () => API.get('/auth/profile/'),
  updateProfile: (data) => API.put('/auth/profile/', data),

  // Addresses
  getAddresses: () => API.get('/auth/addresses/'),
  createAddress: (data) => API.post('/auth/addresses/', data),
  updateAddress: (id, data) => API.put(`/auth/addresses/${id}/`, data),
  deleteAddress: (id) => API.delete(`/auth/addresses/${id}/`),

  // Admin
  getAllUsers: (page = 1, search = '') => API.get(`/auth/admin/users/?page=${page}&search=${search}`),
  manageUser: (userId, action) => API.post(`/auth/admin/users/${userId}/`, { action }),
};
