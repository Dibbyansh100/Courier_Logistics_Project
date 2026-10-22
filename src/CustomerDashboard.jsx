import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { shipmentApi, paymentApi } from './Axios';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import StatusBadge from './StatusBadge';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shipments, setShipments] = useState([]);
  const [payments, setPayments] = useState([]);

  const loadData = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const [sRes, pRes] = await Promise.allSettled([
        shipmentApi.getByCustomer(user.id),
        paymentApi.getByCustomer(user.id),
      ]);

      const sList = sRes.status === 'fulfilled' ? sRes.value.data?.data || [] : [];
      const pList = pRes.status === 'fulfilled' ? pRes.value.data?.data || [] : [];

      setShipments(sList);
      setPayments(pList);
    } catch (err) {
      setError('Failed to fetch your account activities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const activeShipments = shipments.filter(
    (s) => s.status !== 'DELIVERED' && s.status !== 'CANCELLED'
  );
  const deliveredShipments = shipments.filter((s) => s.status === 'DELIVERED');
  const totalSpent = payments
    .filter((p) => p.paymentStatus === 'PAID' || p.paymentStatus === 'COMPLETED')
    .reduce((acc, p) => acc + (p.amount || 0), 0);
  const pendingPayment = payments
    .filter((p) => p.paymentStatus !== 'PAID' && p.paymentStatus !== 'COMPLETED')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  if (loading) return <Loader message="Loading your personal dashboard..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name || 'Customer'}!</h1>
          <p className="page-subtitle">Track your package deliveries and manage shipment bookings</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/customer/book" className="btn btn-primary">
            📦 Book New Shipment
          </Link>
          <Link to="/customer/track" className="btn btn-secondary">
            🔍 Quick Track
          </Link>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadData} />}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Active Shipments</span>
          <span className="stat-value" style={{ color: 'var(--accent-cyan)' }}>
            {activeShipments.length}
          </span>
          <span className="stat-desc">En route to destination</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Delivered Parcels</span>
          <span className="stat-value" style={{ color: 'var(--accent-emerald)' }}>
            {deliveredShipments.length}
          </span>
          <span className="stat-desc">Successfully received</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Paid Freight</span>
          <span className="stat-value">₹{totalSpent.toFixed(2)}</span>
          <span className="stat-desc">Settled shipping charges</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Pending COD / Dues</span>
          <span className="stat-value" style={{ color: 'var(--accent-amber)' }}>
            ₹{pendingPayment.toFixed(2)}
          </span>
          <span className="stat-desc">Payable upon arrival</span>
        </div>
      </div>

      {/* Recent Shipments */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600 }}>My Recent Shipments</h2>
          <Link to="/customer/shipments" className="btn btn-secondary btn-sm">
            View All ({shipments.length}) →
          </Link>
        </div>

        {shipments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>You haven't booked any shipments yet.</p>
            <Link to="/customer/book" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              Book Your First Shipment Now
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tracking Number</th>
                  <th>Destination</th>
                  <th>Weight</th>
                  <th>Shipment Status</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments.slice(-5).reverse().map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong style={{ color: 'var(--accent-cyan)' }}>
                        {s.trackingNumber || `ID #${s.id}`}
                      </strong>
                    </td>
                    <td>{s.destination}</td>
                    <td>{s.weight} kg</td>
                    <td>
                      <StatusBadge status={s.status} />
                    </td>
                    <td>
                      <StatusBadge status={s.payment?.paymentStatus || 'PENDING'} />
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/customer/shipments/${s.id}`} className="btn btn-secondary btn-sm">
                          Details
                        </Link>
                        <Link to={`/customer/track/${s.id}`} className="btn btn-primary btn-sm">
                          Track
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

export default CustomerDashboard;
