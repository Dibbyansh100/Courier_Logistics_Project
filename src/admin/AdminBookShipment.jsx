import React from 'react';
import { Link } from 'react-router-dom';
import BookingWizard from '../BookingWizard';

export const AdminBookShipment = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Book New Shipment (Admin Dispatch)</h1>
          <p className="page-subtitle">Create and initialize an official shipment booking for any customer</p>
        </div>
        <Link to="/admin/shipments" className="btn btn-secondary btn-sm">
          ← Back to Shipments
        </Link>
      </div>

      <BookingWizard isAdmin={true} />
    </div>
  );
};

export default AdminBookShipment;
