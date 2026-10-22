import React from 'react';
import { Link } from 'react-router-dom';
import BookingWizard from '../BookingWizard';

export const CustomerBook = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Book a Shipment</h1>
          <p className="page-subtitle">Schedule a parcel pickup, configure cargo specs, and get instant pricing</p>
        </div>
        <Link to="/customer/shipments" className="btn btn-secondary btn-sm">
          ← View My Shipments
        </Link>
      </div>

      <BookingWizard isAdmin={false} />
    </div>
  );
};

export default CustomerBook;
