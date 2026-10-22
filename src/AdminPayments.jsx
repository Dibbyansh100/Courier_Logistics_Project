import React, { useState, useEffect } from 'react';
import { paymentApi } from './Axios';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import StatusBadge from './StatusBadge';

export const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await paymentApi.list();
      setPayments(res.data?.data || []);
    } catch (err) {
      setError('Failed to fetch payments data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalRevenue = payments
    .filter((p) => p.paymentStatus === 'PAID' || p.paymentStatus === 'COMPLETED')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const pendingRevenue = payments
    .filter((p) => p.paymentStatus !== 'PAID' && p.paymentStatus !== 'COMPLETED')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const filteredPayments = payments.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      String(p.id).includes(q) ||
      p.paymentMethod?.toLowerCase().includes(q) ||
      p.paymentStatus?.toLowerCase().includes(q) ||
      p.customer?.name?.toLowerCase().includes(q)
    );
  });

  if (loading) return <Loader message="Loading financial records..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Payment &amp; Revenue Transactions</h1>
          <p className="page-subtitle">Track settled freight invoices and pending billing collections</p>
        </div>
        <button onClick={fetchPayments} className="btn btn-secondary btn-sm">
          🔄 Refresh
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchPayments} />}

      {/* Revenue Summary */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Collected Revenue</span>
          <span className="stat-value" style={{ color: 'var(--accent-emerald)' }}>
            ₹{totalRevenue.toFixed(2)}
          </span>
          <span className="stat-desc">Completed transactions</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Pending Invoices</span>
          <span className="stat-value" style={{ color: 'var(--accent-amber)' }}>
            ₹{pendingRevenue.toFixed(2)}
          </span>
          <span className="stat-desc">Cash on delivery &amp; awaiting settlement</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total Transactions</span>
          <span className="stat-value">{payments.length}</span>
          <span className="stat-desc">Invoiced orders</span>
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by payment ID, method, or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Total Invoices: {filteredPayments.length}
          </span>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💳</div>
            <p>No payment records found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>INV-#{p.id}</strong>
                    </td>
                    <td>{p.customer?.name || 'Customer #' + p.customer?.id || 'Shipment Customer'}</td>
                    <td>
                      <strong style={{ color: 'var(--accent-emerald)' }}>
                        ₹{p.amount != null ? Number(p.amount).toFixed(2) : '0.00'}
                      </strong>
                    </td>
                    <td>
                      <span className="badge badge-picked-up">{p.paymentMethod || 'CASH'}</span>
                    </td>
                    <td>
                      <StatusBadge status={p.paymentStatus || 'PENDING'} />
                    </td>
                    <td>
                      {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : 'Pending Clearance'}
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

export default AdminPayments;
