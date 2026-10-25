import apiClient from './apiClient';

export const agentService = {
  list: () => apiClient.get('/agents'),
  get: (id) => apiClient.get(`/agents/${id}`),
  create: (data) => apiClient.post('/agents', data),
  update: (id, data) => apiClient.put(`/agents/${id}`, data),
  delete: (id) => apiClient.delete(`/agents/${id}`),
  updateAvailability: (id, availability) =>
    apiClient.put(`/agents/${id}/availability?availability=${availability}`),
  getByContact: (contact) => apiClient.get(`/agents/contact/${contact}`),
};

export default agentService;
