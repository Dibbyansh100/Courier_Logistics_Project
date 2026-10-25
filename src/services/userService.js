import apiClient from './apiClient';

export const userService = {
  create: (data) => apiClient.post('/users/register', data),
  list: () => apiClient.get('/users'),
  getById: (id) => apiClient.get(`/users/${id}`),
};

export default userService;
