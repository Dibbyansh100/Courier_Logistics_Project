import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { shipmentApi } from './Axios';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import StatusBadge from './StatusBadge';

export const CustomerShipments = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchShipments = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const res = await shipmentApi.getByCustomer(user.id);
      setShipments(res.data?.data || []);
    } catch (err) {
      setError('Failed to fetch your shipments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [user?.id]);

  const filtered = shipments.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.trackingNumber?.toLowerCase().includes(q) ||
      s.source?.toLowerCase().includes(q) ||
      s.destination?.toLowerCase().includes(q) ||
      s.status?.toLowerCase().includes(q)
    );
  });

  if (loading) return <Loader message="Loading your shipments..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Shipments</h1>
          <p className="page-subtitle">Track and review all consignments booked under your account</p>
        </div>
        <Link to="/customer/book" className="btn btn-primary">
          ➕ Book New Shipment
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchShipments} />}

      <div className="card">
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by tracking number, city, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Total Packages: {filtered.length}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No shipments found matching your search.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tracking Number</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Weight</th>
                  <th>Shipment Status</th>
                  <th>Payment Status</th>
                  <th>Amount</th>
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
                    <td>{s.source}</td>
                    <td>{s.destination}</td>
                    <td>{s.weight} kg</td>
                    <td>
                      <StatusBadge status={s.status} />
                    </td>
                    <td>
                      <StatusBadge status={s.payment?.paymentStatus || 'PENDING'} />
                    </td>
                    <td>
                      <strong style={{ color: 'var(--accent-emerald)' }}>
                        ₹{s.payment?.amount != null ? Number(s.payment.amount).toFixed(2) : '0.00'}
                      </strong>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/customer/shipments/${s.id}`} className="btn btn-secondary btn-sm">
                          Details
                        </Link>
                        <Link to={`/customer/track/${s.id}`} className="btn btn-primary btn-sm">
                          📍 Track
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

export default CustomerShipments;
