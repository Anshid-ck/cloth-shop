import API from './api';

export const cartAPI = {
  getCart: () => API.get('/cart/'),
  addToCart: (data) => API.post('/cart/add/', data),
  updateCart: (itemId, data) => API.put(`/cart/update/${itemId}/`, data),
  removeFromCart: (itemId) => API.delete(`/cart/remove/${itemId}/`),
  clearCart: () => API.post('/cart/clear/'),
};