import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { shipmentApi } from '../Axios';
import Loader from '../Loader';
import ErrorMessage from '../ErrorMessage';
import StatusBadge from '../StatusBadge';

export const AgentHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHistory = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const res = await shipmentApi.getByAgent(user.id);
      const list = res.data?.data || [];
      // Filter completed shipments
      const completed = list.filter(
        (s) => s.status === 'DELIVERED' || s.status === 'CANCELLED'
      );
      setHistory(completed);
    } catch (err) {
      setError('Failed to fetch delivery history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user?.id]);

  const filtered = history.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.trackingNumber?.toLowerCase().includes(q) ||
      s.destination?.toLowerCase().includes(q) ||
      s.customer?.name?.toLowerCase().includes(q)
    );
  });

  if (loading) return <Loader message="Loading delivery log..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Delivery History Log</h1>
          <p className="page-subtitle">Archive of all completed consignments and successful drop-offs</p>
        </div>
        <button onClick={fetchHistory} className="btn btn-secondary btn-sm">
          🔄 Refresh
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchHistory} />}

      <div className="card">
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by tracking number, customer, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Completed Orders: {filtered.length}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📜</div>
            <p>No completed deliveries recorded yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tracking Number</th>
                  <th>Customer</th>
                  <th>Destination Address</th>
                  <th>Freight Fee</th>
                  <th>Delivery Status</th>
                  <th>Payment Settlement</th>
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
                    <td>
                      <strong style={{ color: 'var(--accent-emerald)' }}>
                        ₹{s.payment?.amount?.toFixed(2) || '0.00'}
                      </strong>
                    </td>
                    <td>
                      <StatusBadge status={s.status} />
                    </td>
                    <td>
                      <StatusBadge status={s.payment?.paymentStatus || 'PAID'} />
                    </td>
                    <td>
                      <Link to={`/agent/shipments/${s.id}`} className="btn btn-secondary btn-sm">
                        Details
                      </Link>
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

export default AgentHistory;
