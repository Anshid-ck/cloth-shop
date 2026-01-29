import API from './api';

export const adminAPI = {
  // Login
  login: (data) => API.post('/admin-panel/login/', data),
  checkAuth: () => API.get('/admin-panel/check/'),
  
  // Dashboard
  getDashboardStats: () => API.get('/admin-panel/dashboard-stats/'),
  getSalesReport: (period = 'monthly') => 
    API.get('/admin-panel/sales-report/', { params: { period } }),
};