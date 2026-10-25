import apiClient from './apiClient';

export const paymentService = {
  list: () => apiClient.get('/payments'),
  getById: (id) => apiClient.get(`/payments/${id}`),
  getByCustomer: (customerId) => apiClient.get(`/payments/customer/${customerId}`),
  update: (id, data) => apiClient.put(`/payments/${id}`, data),
};

export default paymentService;
