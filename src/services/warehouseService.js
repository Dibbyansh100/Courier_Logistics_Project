import apiClient from './apiClient';

export const warehouseService = {
  list: () => apiClient.get('/warehouses'),
  get: (id) => apiClient.get(`/warehouses/${id}`),
  create: (data) => apiClient.post('/warehouses', data),
  update: (id, data) => apiClient.put(`/warehouses/${id}`, data),
  delete: (id) => apiClient.delete(`/warehouses/${id}`),
};

export default warehouseService;
