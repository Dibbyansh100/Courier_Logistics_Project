import React from 'react';

/**
 * StatusBadge component renders a styled status tag with an indicator dot.
 * Supported status strings:
 * - PENDING, BOOKED, PAYMENT_PENDING
 * - PICKED_UP
 * - IN_TRANSIT
 * - OUT_FOR_DELIVERY
 * - DELIVERED, PAID, COMPLETED
 * - CANCELLED, FAILED, UNPAID
 */
export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const raw = String(status).toUpperCase().replace(/\s+/g, '_');

  let badgeClass = 'badge-pending';
  let label = status;

  switch (raw) {
    case 'PAYMENT_PENDING':
      badgeClass = 'badge-pending';
      label = 'Payment pending';
      break;
    case 'PENDING':
      badgeClass = 'badge-pending';
      label = 'Pending';
      break;
    case 'BOOKED':
      badgeClass = 'badge-pending';
      label = 'Booked';
      break;
    case 'PICKED_UP':
      badgeClass = 'badge-picked-up';
      label = 'Picked Up';
      break;
    case 'IN_TRANSIT':
      badgeClass = 'badge-in-transit';
      label = 'In Transit';
      break;
    case 'OUT_FOR_DELIVERY':
      badgeClass = 'badge-out-for-delivery';
      label = 'Out for Delivery';
      break;
    case 'DELIVERED':
      badgeClass = 'badge-delivered';
      label = 'Delivered';
      break;
    case 'PAID':
      badgeClass = 'badge-delivered';
      label = 'Paid';
      break;
    case 'COMPLETED':
      badgeClass = 'badge-delivered';
      label = 'Completed';
      break;
    case 'CANCELLED':
    case 'FAILED':
    case 'UNPAID':
      badgeClass = 'badge-cancelled';
      label = raw === 'UNPAID' ? 'Unpaid' : raw === 'FAILED' ? 'Failed' : 'Cancelled';
      break;
    default:
      badgeClass = 'badge-pending';
      label = status;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span className="badge-dot" />
      {label}
    </span>
  );
};

export default StatusBadge;
