import React from 'react';
import { TrackingView } from '../components/tracking';

/**
 * Operations & Admin Tracking Console.
 * Leverages the unified TrackingView with administrative console access.
 */
export const AdminTracking = () => {
  return (
    <TrackingView
      isAdmin={true}
      title="Consignment Tracking Console"
      subtitle="Administrative parcel inspection, live checkpoint status, and logistics audit"
      placeholder="Search Tracking Number or Consignment ID..."
    />
  );
};

export default AdminTracking;
