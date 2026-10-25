import apiClient from './apiClient';
import authService from './authService';
import customerService from './customerService';
import agentService from './agentService';
import warehouseService from './warehouseService';
import shipmentService from './shipmentService';
import packageService from './packageService';
import paymentService from './paymentService';
import trackingService from './trackingService';
import userService from './userService';

// Modern canonical exports
export {
  apiClient,
  authService,
  customerService,
  agentService,
  warehouseService,
  shipmentService,
  packageService,
  paymentService,
  trackingService,
  userService,
};

// Backward-compatibility aliases (matching previous Axios.jsx naming)
export const authApi = authService;
export const customerApi = customerService;
export const agentApi = agentService;
export const warehouseApi = warehouseService;
export const shipmentApi = shipmentService;
export const packageApi = packageService;
export const paymentApi = paymentService;
export const trackingApi = trackingService;
export const userApi = userService;

export default apiClient;
