import axios from 'axios';

// Base URL configuration (reads VITE_API_URL, fallback http://localhost:8088)
const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8088';
// Ensure base URL points to /api without double slashes
const apiBase = rawBaseUrl.endsWith('/api')
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/+$/, '')}/api`;

const api = axios.create({
  baseURL: apiBase,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach HTTP Basic Auth header if credentials exist in session
api.interceptors.request.use((config) => {
  const userStr = sessionStorage.getItem('authUser');
  const password = sessionStorage.getItem('authPassword');
  if (userStr && password) {
    try {
      const user = JSON.parse(userStr);
      const identifier = user.loginIdentifier || user.username || user.email || '';
      if (identifier) {
        config.headers.Authorization = 'Basic ' + btoa(identifier + ':' + password);
      }
    } catch (e) {
      console.warn('Failed to attach basic auth header', e);
    }
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor: redirect only on genuine unauthenticated sessions (excluding /auth/login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Do not redirect if the failed request is the login attempt itself
    if (error.config?.url?.includes('/auth/login')) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401) {
      // Only clear and redirect if currently on a protected route
      const path = window.location.pathname;
      if (path.startsWith('/admin') || path.startsWith('/customer') || path.startsWith('/agent')) {
        console.warn('401 Unauthorized encountered on protected route:', path);
        sessionStorage.removeItem('authUser');
        sessionStorage.removeItem('authPassword');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (customerData) => api.post('/customers', customerData),
};

// Customer API
export const customerApi = {
  list: () => api.get('/customers'),
  get: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  getByEmail: (email) => api.get(`/customers/email/${email}`),
  getByContact: (contact) => api.get(`/customers/contact/${contact}`),
};

// Delivery Agent API
export const agentApi = {
  list: () => api.get('/agents'),
  get: (id) => api.get(`/agents/${id}`),
  create: (data) => api.post('/agents', data),
  update: (id, data) => api.put(`/agents/${id}`, data),
  delete: (id) => api.delete(`/agents/${id}`),
  updateAvailability: (id, availability) =>
    api.put(`/agents/${id}/availability?availability=${availability}`),
  getByContact: (contact) => api.get(`/agents/contact/${contact}`),
};

// Warehouse API
export const warehouseApi = {
  list: () => api.get('/warehouses'),
  get: (id) => api.get(`/warehouses/${id}`),
  create: (data) => api.post('/warehouses', data),
  update: (id, data) => api.put(`/warehouses/${id}`, data),
  delete: (id) => api.delete(`/warehouses/${id}`),
};

// Shipment API
export const shipmentApi = {
  create: (data) => api.post('/shipments', data),
  list: () => api.get('/shipments'),
  getById: (id) => api.get(`/shipments/${id}`),
  getByCustomer: (customerId) => api.get(`/shipments/customer/${customerId}`),
  getByAgent: (agentId) => api.get(`/shipments/agent/${agentId}`),
  getByWarehouse: (warehouseId) => api.get(`/shipments/warehouse/${warehouseId}`),
  getByTrackingNumber: (trackingNumber) =>
    api.get(`/shipments/tracking/${trackingNumber}`),
  assignAgent: (shipmentId, agentId) =>
    api.put(`/shipments/${shipmentId}/assign-agent/${agentId}`),
  assignWarehouse: (shipmentId, warehouseId) =>
    api.put(`/shipments/${shipmentId}/assign-warehouse/${warehouseId}`),
  updateStatus: (id, data) => api.patch(`/shipments/${id}/status`, data),
  delete: (id) => api.delete(`/shipments/${id}`),
};

// Package API
export const packageApi = {
  list: () => api.get('/packages'),
  getById: (id) => api.get(`/packages/${id}`),
};

// Payment API
export const paymentApi = {
  list: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  getByCustomer: (customerId) => api.get(`/payments/customer/${customerId}`),
  update: (id, data) => api.put(`/payments/${id}`, data),
};

// Tracking API
export const trackingApi = {
  getByShipment: (shipmentId) => api.get(`/tracking/shipment/${shipmentId}`),
  getByTrackingNumber: (trackingNumber) =>
    api.get(`/tracking/shipment/tracking/${trackingNumber}`),
  getById: (id) => api.get(`/tracking/${id}`),
};

// User (Admin) API
export const userApi = {
  create: (data) => api.post('/users/register', data),
  list: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
};

export default api;
