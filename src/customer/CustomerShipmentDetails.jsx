import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { shipmentApi } from '../Axios';
import Loader from '../Loader';
import ErrorMessage from '../ErrorMessage';
import StatusBadge from '../StatusBadge';

export const CustomerShipmentDetails = () => {
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await shipmentApi.getById(id);
        setShipment(res.data?.data || res.data);
      } catch (err) {
        setError('Failed to load shipment consignment record.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <Loader message="Loading shipment details..." />;
  if (error || !shipment) return <ErrorMessage message={error || 'Shipment not found'} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Shipment <span style={{ color: 'var(--accent-cyan)' }}>{shipment.trackingNumber || '#' + shipment.id}</span>
          </h1>
          <p className="page-subtitle">Complete package overview and consignment status</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/customer/track/${shipment.id}`} className="btn btn-primary">
            Track Live Status
          </Link>
          <Link to="/customer/shipments" className="btn btn-secondary">
            ← Back to Shipments
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Status & Payment */}
        <div className="card">
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>📦 Status &amp; Invoicing</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Shipment Status:</span>
            <StatusBadge status={shipment.status} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Payment Status:</span>
            <StatusBadge status={shipment.payment?.paymentStatus || 'PENDING'} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Freight Amount:</span>
            <strong style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem' }}>
              ₹{shipment.payment?.amount?.toFixed(2) || '0.00'}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span>
            <span>{shipment.payment?.paymentMethod || 'CASH ON DELIVERY'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Booked On:</span>
            <span>{shipment.shipmentDateTime ? new Date(shipment.shipmentDateTime).toLocaleString() : 'Recent'}</span>
          </div>
        </div>

        {/* Route Details */}
        <div className="card">
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>📍 Journey &amp; Destination</h2>
          <div style={{ marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>PICKUP ORIGIN</span>
            <strong>{shipment.source}</strong>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>DELIVERY DESTINATION</span>
            <strong>{shipment.destination}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>DELIVERY AGENT</span>
            <span>{shipment.deliveryAgent ? `🚴 ${shipment.deliveryAgent.name} (${shipment.deliveryAgent.contact})` : 'Courier agent will be assigned shortly'}</span>
          </div>
        </div>

        {/* Package Specifications */}
        <div className="card">
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>📋 Package Specifications</h2>
          {shipment.packageEntity ? (
            <div style={{ lineHeight: '1.8', fontSize: '0.9rem' }}>
              <div><strong>Description:</strong> {shipment.packageEntity.description}</div>
              <div><strong>Package Type:</strong> {shipment.packageEntity.packageType}</div>
              <div><strong>Gross Weight:</strong> {shipment.packageEntity.weight} kg</div>
              <div>
                <strong>Handling:</strong>{' '}
                {shipment.packageEntity.fragile ? (
                  <span className="badge badge-cancelled">⚠️ Fragile Cargo</span>
                ) : (
                  <span className="badge badge-delivered">Standard Safe</span>
                )}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Standard parcel box ({shipment.weight} kg)</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerShipmentDetails;
