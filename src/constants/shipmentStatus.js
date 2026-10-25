/**
 * Shipment statuses and transit stage milestones.
 */
export const SHIPMENT_STATUS = {
  PENDING: 'PENDING',
  BOOKED: 'BOOKED',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

/**
 * Linear milestone stages used in timeline progression steppers.
 */
export const TRACKING_STAGES = [
  { key: 'BOOKED', label: 'Booked' },
  { key: 'PICKED_UP', label: 'Picked Up' },
  { key: 'IN_TRANSIT', label: 'In Transit' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
];

/**
 * Payment statuses recognized in the invoicing system.
 */
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
};

/**
 * Supported package types strictly accepted by backend PackageType enum.
 */
export const PACKAGE_TYPES = {
  BOX: 'BOX',
  PARCEL: 'PARCEL',
  ENVELOPE: 'ENVELOPE',
};

export default SHIPMENT_STATUS;
