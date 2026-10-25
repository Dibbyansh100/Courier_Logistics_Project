import React from 'react';
import { TrackingView } from '../components/tracking';

/**
 * Customer Consignment Live Tracking View.
 * Wraps the unified TrackingView component.
 */
export const CustomerTrack = () => {
  return (
    <TrackingView
      isAdmin={false}
      title="Track shipment"
      subtitle="Enter a shipment ID to see where your parcel is."
      placeholder="SH-1042 or TRK-..."
    />
  );
};

export default CustomerTrack;
