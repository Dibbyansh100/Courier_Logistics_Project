import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { shipmentApi, agentApi } from '../Axios';
import Loader from '../Loader';
import ErrorMessage from '../ErrorMessage';
import StatusBadge from '../StatusBadge';

export const AgentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [agentDetails, setAgentDetails] = useState(null);
  const [assignedShipments, setAssignedShipments] = useState([]);

  const loadData = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const [aRes, sRes] = await Promise.allSettled([
        agentApi.get(user.id),
        shipmentApi.getByAgent(user.id),
      ]);

      if (aRes.status === 'fulfilled') {
        setAgentDetails(aRes.value.data?.data || null);
      }
      if (sRes.status === 'fulfilled') {
        setAssignedShipments(sRes.value.data?.data || []);
      }
    } catch (err) {
      setError('Failed to fetch assigned delivery tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const activeDeliveries = assignedShipments.filter(
    (s) => s.status !== 'DELIVERED' && s.status !== 'CANCELLED'
  );
  const completedDeliveries = assignedShipments.filter((s) => s.status === 'DELIVERED');

  if (loading) return <Loader message="Loading courier agent console..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Courier Console: {user?.name || 'Agent'}</h1>
          <p className="page-subtitle">Track your delivery queue, dispatch routes, and update shipment status</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span className={`badge ${agentDetails?.availability ? 'badge-delivered' : 'badge-cancelled'}`}>
            <span className="badge-dot" />
            {agentDetails?.availability ? 'On Duty (Available)' : 'In Transit / Busy'}
          </span>
          <button onClick={loadData} className="btn btn-secondary btn-sm">
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadData} />}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Pending Deliveries</span>
          <span className="stat-value" style={{ color: 'var(--accent-amber)' }}>
            {activeDeliveries.length}
          </span>
          <span className="stat-desc">Packages awaiting drop-off</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Delivered Successfully</span>
          <span className="stat-value" style={{ color: 'var(--accent-emerald)' }}>
            {completedDeliveries.length}
          </span>
          <span className="stat-desc">Completed consignments</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Courier Vehicle</span>
          <span className="stat-value" style={{ fontSize: '1.4rem', color: 'var(--accent-cyan)' }}>
            {agentDetails?.vehicleNo || 'Two-Wheeler'}
          </span>
          <span className="stat-desc">Registered vehicle</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Performance Rating</span>
          <span className="stat-value" style={{ color: '#fbbf24' }}>
            ⭐ {agentDetails?.rating != null ? Number(agentDetails.rating).toFixed(1) : '5.0'}
          </span>
          <span className="stat-desc">Customer satisfaction</span>
        </div>
      </div>

      {/* Active Delivery Queue */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Active Delivery Route</h2>
          <Link to="/agent/shipments" className="btn btn-secondary btn-sm">
            View Full Queue →
          </Link>
        </div>

        {activeDeliveries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛵</div>
            <p>No active deliveries pending right now. Great job!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tracking Number</th>
                  <th>Destination Address</th>
                  <th>Receiver Contact</th>
                  <th>Status</th>
                  <th>Fragile Item</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeDeliveries.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong style={{ color: 'var(--accent-cyan)' }}>
                        {s.trackingNumber || `ID #${s.id}`}
                      </strong>
                    </td>
                    <td>{s.destination}</td>
                    <td>{s.customer?.contact || 'N/A'}</td>
                    <td>
                      <StatusBadge status={s.status} />
                    </td>
                    <td>
                      {s.packageEntity?.fragile ? (
                        <span className="badge badge-cancelled">⚠️ Handle with Care</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Standard</span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/agent/status/${s.id}`} className="btn btn-primary btn-sm">
                          Update Status
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

export default AgentDashboard;
