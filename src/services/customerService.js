import apiClient from './apiClient';

export const customerService = {
  list: () => apiClient.get('/customers'),
  get: (id) => apiClient.get(`/customers/${id}`),
  create: (data) => apiClient.post('/customers', data),
  update: (id, data) => apiClient.put(`/customers/${id}`, data),
  delete: (id) => apiClient.delete(`/customers/${id}`),
  getByEmail: (email) => apiClient.get(`/customers/email/${email}`),
  getByContact: (contact) => apiClient.get(`/customers/contact/${contact}`),
};

export default customerService;
