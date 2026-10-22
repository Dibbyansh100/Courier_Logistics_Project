import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { paymentApi } from '../Axios';
import Loader from '../Loader';
import ErrorMessage from '../ErrorMessage';
import StatusBadge from '../StatusBadge';

export const CustomerPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPayments = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const res = await paymentApi.getByCustomer(user.id);
      setPayments(res.data?.data || []);
    } catch (err) {
      setError('Failed to fetch payment invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user?.id]);

  const filtered = payments.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      String(p.id).includes(q) ||
      p.paymentMethod?.toLowerCase().includes(q) ||
      p.paymentStatus?.toLowerCase().includes(q)
    );
  });

  const totalPaid = payments
    .filter((p) => p.paymentStatus === 'PAID' || p.paymentStatus === 'COMPLETED')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const totalPending = payments
    .filter((p) => p.paymentStatus !== 'PAID' && p.paymentStatus !== 'COMPLETED')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  if (loading) return <Loader message="Loading invoices & payments..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Payment History &amp; Invoices</h1>
          <p className="page-subtitle">View billed invoices and receipt statements for your shipments</p>
        </div>
        <button onClick={fetchPayments} className="btn btn-secondary btn-sm">
          🔄 Refresh
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchPayments} />}

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Amount Paid</span>
          <span className="stat-value" style={{ color: 'var(--accent-emerald)' }}>
            ₹{totalPaid.toFixed(2)}
          </span>
          <span className="stat-desc">Cleared transactions</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Pending Payment</span>
          <span className="stat-value" style={{ color: 'var(--accent-amber)' }}>
            ₹{totalPending.toFixed(2)}
          </span>
          <span className="stat-desc">Payable upon package receipt</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total Invoices</span>
          <span className="stat-value">{payments.length}</span>
          <span className="stat-desc">Orders placed</span>
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by invoice number or payment method..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Invoices: {filtered.length}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💳</div>
            <p>No payment records available.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Payment Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>INV-#{p.id}</strong>
                    </td>
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
                      {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : 'Upon Delivery'}
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

export default CustomerPayments;
