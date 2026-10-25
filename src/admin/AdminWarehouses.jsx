import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { warehouseApi } from '../Axios';
import Loader from '../Loader';
import ErrorMessage from '../ErrorMessage';

export const AdminWarehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchWarehouses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await warehouseApi.list();
      setWarehouses(res.data?.data || []);
    } catch (err) {
      setError('Failed to fetch warehouses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete warehouse hub "${name}"? This action cannot be undone.`)) {
      return;
    }
    setActionLoading(true);
    try {
      await warehouseApi.delete(id);
      setWarehouses((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete warehouse. Check if shipments are currently routed through it.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredWarehouses = warehouses.filter((w) => {
    const q = searchTerm.toLowerCase();
    return (
      w.name?.toLowerCase().includes(q) ||
      w.location?.toLowerCase().includes(q) ||
      w.contact?.toLowerCase().includes(q)
    );
  });

  if (loading) return <Loader message="Loading warehouses..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Warehouse Hubs</h1>
          <p className="page-subtitle">Manage distribution centers, transit hubs, and sorting facilities</p>
        </div>
        <Link to="/admin/warehouses/new" className="btn btn-primary">
           Add Warehouse
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchWarehouses} />}

      <div className="card">
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by warehouse name, location, or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Total Hubs: {filteredWarehouses.length}
          </span>
        </div>

        {filteredWarehouses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <p>No warehouses found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Warehouse Name</th>
                  <th>Location / City</th>
                  <th>Capacity</th>
                  <th>Contact Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWarehouses.map((w) => (
                  <tr key={w.id}>
                    <td>#{w.id}</td>
                    <td>
                      <strong>{w.name}</strong>
                    </td>
                    <td>
                      <span>{w.location}</span>
                    </td>
                    <td>{w.capacity ? `${w.capacity} Units` : 'Standard'}</td>
                    <td>{w.contact}</td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/admin/warehouses/${w.id}/edit`} className="btn btn-secondary btn-sm">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(w.id, w.name)}
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

export default AdminWarehouses;
