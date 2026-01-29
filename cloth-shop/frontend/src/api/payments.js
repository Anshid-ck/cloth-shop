import API from './api';

export const paymentsAPI = {
  createPayment: (data) => API.post('/payments/create/', data),
  confirmPayment: (data) =>API.post('/payments/confirm/', data),
  verifyStripe: (data) => API.post('payments/confirm/', data),
  getPayment: (orderId) => API.get(`/payments/order/${orderId}/`),

  // Refund management
  requestRefund: (data) => API.post('/payments/refund/request/', data),
  getRefund: (refundId) => API.get(`/payments/refund/${refundId}/`),
};