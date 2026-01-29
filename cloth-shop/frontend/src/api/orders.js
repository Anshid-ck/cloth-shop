import API from './api';

export const ordersAPI = {
  getOrders: () => API.get('/orders/'),
  getOrder: (id) => API.get(`/orders/${id}/`),
  createOrder: (data) => API.post('/orders/create/', data),
  trackOrder: (id) => API.get(`/orders/${id}/track/`),
  cancelOrder: (id) => API.post(`/orders/${id}/cancel/`),
};