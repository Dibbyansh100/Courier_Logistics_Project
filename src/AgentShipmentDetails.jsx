import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { shipmentApi } from './Axios';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import StatusBadge from './StatusBadge';

export const AgentShipmentDetails = () => {
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
        setError('Failed to load shipment details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <Loader message="Loading consignment info..." />;
  if (error || !shipment) return <ErrorMessage message={error || 'Shipment not found'} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Delivery Task: <span style={{ color: 'var(--accent-cyan)' }}>{shipment.trackingNumber || '#' + shipment.id}</span>
          </h1>
          <p className="page-subtitle">Doorstep drop-off instructions, customer contact, and cash collection</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/agent/status/${shipment.id}`} className="btn btn-primary">
            ⚡ Update Delivery Status
          </Link>
          <Link to="/agent/shipments" className="btn btn-secondary">
            ← Back to Tasks
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Drop-off & Customer Contact */}
        <div className="card">
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>📍 Delivery Drop-off</h2>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>CUSTOMER / RECIPIENT</span>
            <strong style={{ fontSize: '1.1rem' }}>{shipment.customer?.name}</strong>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>CALL CONTACT PHONE</span>
            <a
              href={`tel:${shipment.customer?.contact}`}
              style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'underline' }}
            >
              📞 {shipment.customer?.contact || 'N/A'}
            </a>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>FULL DELIVERY ADDRESS</span>
            <p style={{ marginTop: '0.25rem', lineHeight: '1.5', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              {shipment.destination}
            </p>
          </div>
        </div>

        {/* Payment to Collect */}
        <div className="card">
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>💰 Collection &amp; Payment</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Payment Status:</span>
            <StatusBadge status={shipment.payment?.paymentStatus || 'PENDING'} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span>
            <span className="badge badge-picked-up">{shipment.payment?.paymentMethod || 'CASH ON DELIVERY'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Amount to Collect:</span>
            <strong style={{ color: 'var(--accent-emerald)', fontSize: '1.3rem' }}>
              ₹{shipment.payment?.amount?.toFixed(2) || '0.00'}
            </strong>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', background: 'rgba(245, 158, 11, 0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
            ℹ️ When you mark this consignment as <strong>Delivered</strong>, the payment will automatically be settled as <strong>Paid</strong> in the system.
          </div>
        </div>

        {/* Parcel Details */}
        <div className="card">
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>📦 Parcel Details</h2>
          <div style={{ lineHeight: '1.8', fontSize: '0.9rem' }}>
            <div><strong>Description:</strong> {shipment.packageEntity?.description || 'General Cargo'}</div>
            <div><strong>Weight:</strong> {shipment.weight} kg</div>
            <div>
              <strong>Handling Type:</strong>{' '}
              {shipment.packageEntity?.fragile ? (
                <span className="badge badge-cancelled" style={{ fontSize: '0.85rem' }}>
                  ⚠️ FRAGILE: DO NOT DROP OR CRUSH
                </span>
              ) : (
                <span className="badge badge-delivered">Standard Safe Cargo</span>
              )}
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Dispatched Hub:</span>{' '}
              <span>{shipment.warehouse?.name || 'Local Distribution Center'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentShipmentDetails;
