import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { shipmentApi } from '../Axios';
import Loader from '../Loader';
import ErrorMessage from '../ErrorMessage';
import StatusBadge from '../StatusBadge';

export const AdminShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchShipments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await shipmentApi.list();
      setShipments(res.data?.data || []);
    } catch (err) {
      setError('Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleDelete = async (id, trackingNumber) => {
    if (!window.confirm(`Delete shipment ${trackingNumber || '#' + id}? This will remove all associated tracking checkpoints.`)) {
      return;
    }
    setActionLoading(true);
    try {
      await shipmentApi.delete(id);
      setShipments((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete shipment');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredShipments = shipments.filter((s) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      s.trackingNumber?.toLowerCase().includes(q) ||
      s.customer?.name?.toLowerCase().includes(q) ||
      s.source?.toLowerCase().includes(q) ||
      s.destination?.toLowerCase().includes(q) ||
      s.deliveryAgent?.name?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && s.status !== 'DELIVERED' && s.status !== 'CANCELLED') ||
      s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loader message="Loading shipments..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Shipment Consignments</h1>
          <p className="page-subtitle">Track, monitor, assign and dispatch cargo across all hubs</p>
        </div>
        <Link to="/admin/shipments/new" className="btn btn-primary">
           Book New Shipment
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchShipments} />}

      <div className="card">
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by tracking #, customer, agent, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active (In Transit / Pending)</option>
              <option value="PENDING">Pending / Booked</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Count: {filteredShipments.length}
            </span>
          </div>
        </div>

        {filteredShipments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <p>No shipments found matching the filters.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tracking Number</th>
                  <th>Customer</th>
                  <th>Route</th>
                  <th>Weight</th>
                  <th>Agent</th>
                  <th>Hub</th>
                  <th>Shipment Status</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong style={{ color: 'var(--accent-cyan)' }}>
                        {s.trackingNumber || `ID #${s.id}`}
                      </strong>
                    </td>
                    <td>{s.customer?.name || 'Customer #' + s.customer?.id}</td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        <div>From: {s.source}</div>
                        <div style={{ color: 'var(--text-muted)' }}>To: {s.destination}</div>
                      </div>
                    </td>
                    <td>{s.weight} kg</td>
                    <td>
                      {s.deliveryAgent ? (
                        <span>🚴 {s.deliveryAgent.name}</span>
                      ) : (
                        <span style={{ color: 'var(--text-subtle)', fontStyle: 'italic' }}>Unassigned</span>
                      )}
                    </td>
                    <td>{s.warehouse?.name || 'Unassigned'}</td>
                    <td>
                      <StatusBadge status={s.status} />
                    </td>
                    <td>
                      <StatusBadge status={s.payment?.paymentStatus || 'PENDING'} />
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/admin/shipments/${s.id}`} className="btn btn-secondary btn-sm">
                          Details
                        </Link>
                        <Link to={`/admin/tracking/${s.id}`} className="btn btn-secondary btn-sm" title="View tracking timeline">
                          Track
                        </Link>
                        <button
                          onClick={() => handleDelete(s.id, s.trackingNumber)}
                          className="btn btn-danger btn-sm"
                          disabled={actionLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminShipments;
