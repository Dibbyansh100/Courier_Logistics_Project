import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { shipmentApi, customerApi, agentApi, warehouseApi, paymentApi } from '../Axios';
import Loader from '../Loader';
import ErrorMessage from '../ErrorMessage';
import StatusBadge from '../StatusBadge';

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [stats, setStats] = useState({
    shipments: 0,
    active: 0,
    delivered: 0,
    customers: 0,
    agents: 0,
    warehouses: 0,
    totalRevenue: 0,
  });

  const [recentShipments, setRecentShipments] = useState([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [sRes, cRes, aRes, wRes, pRes] = await Promise.allSettled([
        shipmentApi.list(),
        customerApi.list(),
        agentApi.list(),
        warehouseApi.list(),
        paymentApi.list(),
      ]);

      const shipmentsList = sRes.status === 'fulfilled' ? sRes.value.data?.data || [] : [];
      const customersList = cRes.status === 'fulfilled' ? cRes.value.data?.data || [] : [];
      const agentsList = aRes.status === 'fulfilled' ? aRes.value.data?.data || [] : [];
      const warehousesList = wRes.status === 'fulfilled' ? wRes.value.data?.data || [] : [];
      const paymentsList = pRes.status === 'fulfilled' ? pRes.value.data?.data || [] : [];

      const activeCount = shipmentsList.filter(
        (s) => s.status !== 'DELIVERED' && s.status !== 'CANCELLED'
      ).length;
      const deliveredCount = shipmentsList.filter((s) => s.status === 'DELIVERED').length;
      const revenue = paymentsList.reduce((acc, p) => acc + (p.amount || 0), 0);

      setStats({
        shipments: shipmentsList.length,
        active: activeCount,
        delivered: deliveredCount,
        customers: customersList.length,
        agents: agentsList.length,
        warehouses: warehousesList.length,
        totalRevenue: revenue,
      });

      // Show up to 5 most recent
      setRecentShipments(shipmentsList.slice(-5).reverse());
    } catch (err) {
      setError('Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loader message="Loading administrator dashboard..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Operations Dashboard</h1>
          <p className="page-subtitle">Central logistics management and fleet oversight</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchDashboardData} className="btn btn-secondary btn-sm">
            🔄 Refresh
          </button>
          <Link to="/admin/shipments/new" className="btn btn-primary btn-sm">
             New Shipment
          </Link>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchDashboardData} />}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Shipments</span>
          <span className="stat-value">{stats.shipments}</span>
          <span className="stat-desc">Lifetime cargo packages</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Active in Transit</span>
          <span className="stat-value" style={{ color: 'var(--accent-cyan)' }}>
            {stats.active}
          </span>
          <span className="stat-desc">Pending &amp; out for delivery</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Successfully Delivered</span>
          <span className="stat-value" style={{ color: 'var(--accent-emerald)' }}>
            {stats.delivered}
          </span>
          <span className="stat-desc">Fulfilled consignments</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Fleet &amp; Hubs</span>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
            <span className="stat-value" style={{ fontSize: '1.4rem' }}>
              {stats.agents} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Agents</span>
            </span>
            <span className="stat-value" style={{ fontSize: '1.4rem' }}>
              {stats.warehouses} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hubs</span>
            </span>
          </div>
          <span className="stat-desc">{stats.customers} Registered Customers</span>
        </div>
      </div>

      {/* Recent Shipments */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Recent Shipments</h2>
          <Link to="/admin/shipments" className="btn btn-secondary btn-sm">
            View All Shipments →
          </Link>
        </div>

        {recentShipments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>No shipments found. Start by booking a shipment!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tracking Number</th>
                  <th>Customer</th>
                  <th>Route (Origin → Dest)</th>
                  <th>Weight</th>
                  <th>Shipment Status</th>
                  <th>Payment Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentShipments.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong style={{ color: 'var(--accent-cyan)' }}>
                        {s.trackingNumber || `ID #${s.id}`}
                      </strong>
                    </td>
                    <td>{s.customer?.name || 'Customer #' + s.customer?.id}</td>
                    <td>
                      {s.source} → {s.destination}
                    </td>
                    <td>{s.weight} kg</td>
                    <td>
                      <StatusBadge status={s.status} />
                    </td>
                    <td>
                      <StatusBadge status={s.payment?.paymentStatus || 'PENDING'} />
                    </td>
                    <td>
                      <Link to={`/admin/shipments/${s.id}`} className="btn btn-secondary btn-sm">
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

export default AdminDashboard;
