import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { shipmentApi } from './Axios';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import StatusBadge from './StatusBadge';

export const AgentShipments = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAssigned = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const res = await shipmentApi.getByAgent(user.id);
      setShipments(res.data?.data || []);
    } catch (err) {
      setError('Failed to fetch assigned shipments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, [user?.id]);

  const filtered = shipments.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.trackingNumber?.toLowerCase().includes(q) ||
      s.destination?.toLowerCase().includes(q) ||
      s.customer?.name?.toLowerCase().includes(q) ||
      s.customer?.contact?.includes(q)
    );
  });

  if (loading) return <Loader message="Loading assigned shipments..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Assigned Deliveries</h1>
          <p className="page-subtitle">Packages assigned to you for pickup and doorstep delivery</p>
        </div>
        <button onClick={fetchAssigned} className="btn btn-secondary btn-sm">
          🔄 Refresh
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchAssigned} />}

      <div className="card">
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by tracking number, address, or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Total Assigned: {filtered.length}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>No assigned shipments found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tracking Number</th>
                  <th>Customer Name</th>
                  <th>Destination Address</th>
                  <th>Customer Phone</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong style={{ color: 'var(--accent-cyan)' }}>
                        {s.trackingNumber || `ID #${s.id}`}
                      </strong>
                    </td>
                    <td>{s.customer?.name || 'Customer #' + s.customer?.id}</td>
                    <td>{s.destination}</td>
                    <td>{s.customer?.contact || 'N/A'}</td>
                    <td>
                      <StatusBadge status={s.status} />
                    </td>
                    <td>
                      <StatusBadge status={s.payment?.paymentStatus || 'PENDING'} />
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/agent/status/${s.id}`} className="btn btn-primary btn-sm">
                          ⚡ Status
                        </Link>
                        <Link to={`/agent/shipments/${s.id}`} className="btn btn-secondary btn-sm">
                          Details
                        </Link>
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

export default AgentShipments;
