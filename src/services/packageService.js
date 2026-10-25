import apiClient from './apiClient';

export const packageService = {
  list: () => apiClient.get('/packages'),
  getById: (id) => apiClient.get(`/packages/${id}`),
};

export default packageService;
