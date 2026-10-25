import apiClient from './apiClient';

export const trackingService = {
  getByShipment: (shipmentId) => apiClient.get(`/tracking/shipment/${shipmentId}`),
  getByTrackingNumber: (trackingNumber) =>
    apiClient.get(`/tracking/shipment/tracking/${trackingNumber}`),
  getById: (id) => apiClient.get(`/tracking/${id}`),
};

export default trackingService;
