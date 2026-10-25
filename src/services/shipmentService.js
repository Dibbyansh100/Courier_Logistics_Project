import apiClient from './apiClient';

export const shipmentService = {
  create: (data) => apiClient.post('/shipments', data),
  list: () => apiClient.get('/shipments'),
  getById: (id) => apiClient.get(`/shipments/${id}`),
  getByCustomer: (customerId) => apiClient.get(`/shipments/customer/${customerId}`),
  getByAgent: (agentId) => apiClient.get(`/shipments/agent/${agentId}`),
  getByWarehouse: (warehouseId) => apiClient.get(`/shipments/warehouse/${warehouseId}`),
  getByTrackingNumber: (trackingNumber) =>
    apiClient.get(`/shipments/tracking/${trackingNumber}`),
  assignAgent: (shipmentId, agentId) =>
    apiClient.put(`/shipments/${shipmentId}/assign-agent/${agentId}`),
  assignWarehouse: (shipmentId, warehouseId) =>
    apiClient.put(`/shipments/${shipmentId}/assign-warehouse/${warehouseId}`),
  updateStatus: (id, data) => apiClient.patch(`/shipments/${id}/status`, data),
  delete: (id) => apiClient.delete(`/shipments/${id}`),
};

export default shipmentService;
