import apiClient from './apiClient';

export const authService = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (customerData) => apiClient.post('/customers', customerData),
};

export default authService;
