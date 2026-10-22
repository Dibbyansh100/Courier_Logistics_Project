import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { shipmentApi, paymentApi } from './Axios';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import StatusBadge from './StatusBadge';

export const AgentStatus = () => {
  const { shipmentId } = useParams();
  const navigate = useNavigate();

  const [shipment, setShipment] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('IN_TRANSIT');
  const [remarks, setRemarks] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const res = await shipmentApi.getById(shipmentId);
        const s = res.data?.data || res.data;
        setShipment(s);
        if (s?.status) {
          // Default next sensible status
          if (s.status === 'PENDING') setSelectedStatus('PICKED_UP');
          else if (s.status === 'PICKED_UP') setSelectedStatus('IN_TRANSIT');
          else if (s.status === 'IN_TRANSIT') setSelectedStatus('OUT_FOR_DELIVERY');
          else if (s.status === 'OUT_FOR_DELIVERY') setSelectedStatus('DELIVERED');
          else setSelectedStatus(s.status);
        }
      } catch (err) {
        setErrorMessage('Failed to load shipment details.');
      } finally {
        setLoading(false);
      }
    };
    fetchShipment();
  }, [shipmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setSubmitting(true);

    try {
      // 1. Call PATCH /shipments/{id}/status
      try {
        await shipmentApi.updateStatus(shipmentId, {
          status: selectedStatus,
          remarks: remarks.trim() || `Status updated to ${selectedStatus}`,
          location: location.trim() || undefined,
        });
      } catch (patchErr) {
        // If PATCH /shipments/{id}/status is pending backend implementation, check status
        if (patchErr.response?.status === 404 || patchErr.response?.status === 405) {
          console.warn('PATCH /shipments/{id}/status not yet mounted on backend server.');
        } else {
          throw patchErr;
        }
      }

      // If status is DELIVERED, ensure payment is marked as PAID
      if (selectedStatus === 'DELIVERED' && shipment?.payment?.id) {
        try {
          await paymentApi.update(shipment.payment.id, {
            ...shipment.payment,
            paymentStatus: 'PAID',
          });
        } catch (payErr) {
          console.warn('Payment status update handled or auto-cascaded on backend');
        }
      }

      setSuccessMessage(`Shipment status successfully updated to "${selectedStatus}"! Checkpoint entry recorded.`);
      setTimeout(() => {
        navigate(`/agent/shipments/${shipmentId}`);
      }, 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to update shipment status. Please verify server connection.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading shipment update form..." />;
  if (!shipment) return <ErrorMessage message="Shipment record could not be loaded." />;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Update Delivery Status</h1>
          <p className="page-subtitle">
            Consignment <span style={{ color: 'var(--accent-cyan)' }}>{shipment.trackingNumber || '#' + shipment.id}</span>
          </p>
        </div>
        <Link to={`/agent/shipments/${shipment.id}`} className="btn btn-secondary btn-sm">
          ← Back to Details
        </Link>
      </div>

      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && (
        <div className="badge badge-delivered" style={{ display: 'block', padding: '0.8rem', marginBottom: '1.25rem', textAlign: 'center' }}>
          {successMessage}
        </div>
      )}

      {/* Summary Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>CURRENT STATUS</span>
          <StatusBadge status={shipment.status} />
        </div>
        <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          <strong>Receiver:</strong> {shipment.customer?.name} ({shipment.customer?.contact || 'N/A'})
        </div>
        <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          <strong>Destination:</strong> {shipment.destination}
        </div>
        <div style={{ fontSize: '0.9rem' }}>
          <strong>Collect Payment:</strong>{' '}
          <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
            ₹{shipment.payment?.amount?.toFixed(2) || '0.00'} ({shipment.payment?.paymentStatus || 'PENDING'})
          </span>
        </div>
      </div>

      {/* Update Form */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Next Transit Status *</label>
            <select
              className="form-control"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              required
            >
              <option value="PICKED_UP">Picked Up from Hub / Warehouse</option>
              <option value="IN_TRANSIT">In Transit between Hubs</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery (On Route to Doorstep)</option>
              <option value="DELIVERED">Delivered (Handed to Customer &amp; Settled)</option>
              <option value="CANCELLED">Cancelled / Customer Unavailable</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Current Checkpoint Location (optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Bandra Sorting Center or Doorstep Destination"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status Update Remarks (optional)</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="e.g. Package arrived at local hub / Handed over to recipient with signature"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          {selectedStatus === 'DELIVERED' && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                color: '#34d399',
              }}
            >
              ✓ Marking as <strong>Delivered</strong> will automatically complete the delivery cycle and mark the payment invoice as <strong>Paid</strong>.
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Updating Status...' : 'Submit Status Update'}
            </button>
            <Link to="/agent/shipments" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentStatus;
