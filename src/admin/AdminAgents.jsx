import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { agentApi } from '../Axios';
import Loader from '../Loader';
import ErrorMessage from '../ErrorMessage';

export const AdminAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAgents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await agentApi.list();
      setAgents(res.data?.data || []);
    } catch (err) {
      setError('Failed to fetch delivery agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleToggleAvailability = async (agent) => {
    setActionLoading(true);
    try {
      const newStatus = !agent.availability;
      await agentApi.updateAvailability(agent.id, newStatus);
      setAgents((prev) =>
        prev.map((a) => (a.id === agent.id ? { ...a, availability: newStatus } : a))
      );
    } catch (err) {
      alert('Failed to update agent availability status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete delivery agent "${name}"? This action cannot be undone.`)) {
      return;
    }
    setActionLoading(true);
    try {
      await agentApi.delete(id);
      setAgents((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete agent. Ensure no active shipments assigned.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAgents = agents.filter((a) => {
    const q = searchTerm.toLowerCase();
    return (
      a.name?.toLowerCase().includes(q) ||
      a.contact?.toLowerCase().includes(q) ||
      a.vehicleNo?.toLowerCase().includes(q)
    );
  });

  if (loading) return <Loader message="Loading delivery agents..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Delivery Fleet Management</h1>
          <p className="page-subtitle">Track and configure delivery personnel &amp; courier vehicles</p>
        </div>
        <Link to="/admin/agents/new" className="btn btn-primary">
          ➕ Add Delivery Agent
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchAgents} />}

      <div className="card">
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by agent name, phone, or vehicle number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Total Agents: {filteredAgents.length}
          </span>
        </div>

        {filteredAgents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🚴</div>
            <p>No delivery agents found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Agent Name</th>
                  <th>Contact Phone</th>
                  <th>Vehicle Number</th>
                  <th>Rating</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((a) => (
                  <tr key={a.id}>
                    <td>#{a.id}</td>
                    <td>
                      <strong>{a.name}</strong>
                    </td>
                    <td>{a.contact}</td>
                    <td>
                      <code style={{ color: 'var(--accent-cyan)' }}>{a.vehicleNo || 'N/A'}</code>
                    </td>
                    <td>⭐ {a.rating != null ? Number(a.rating).toFixed(1) : '5.0'}</td>
                    <td>
                      <button
                        onClick={() => handleToggleAvailability(a)}
                        className={`badge ${a.availability ? 'badge-delivered' : 'badge-cancelled'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle availability"
                        disabled={actionLoading}
                      >
                        <span className="badge-dot" />
                        {a.availability ? 'Available' : 'Busy / Inactive'}
                      </button>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/admin/agents/${a.id}/edit`} className="btn btn-secondary btn-sm">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(a.id, a.name)}
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

export default AdminAgents;
