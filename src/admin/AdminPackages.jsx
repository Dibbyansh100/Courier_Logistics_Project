import React, { useState, useEffect } from 'react';
import { packageApi } from '../Axios';
import Loader from '../Loader';
import ErrorMessage from '../ErrorMessage';

export const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPackages = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await packageApi.list();
      setPackages(res.data?.data || []);
    } catch (err) {
      setError('Failed to fetch packages list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const filteredPackages = packages.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.description?.toLowerCase().includes(q) ||
      p.packageType?.toLowerCase().includes(q) ||
      String(p.id).includes(q)
    );
  });

  if (loading) return <Loader message="Loading cargo packages..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Package Inventory</h1>
          <p className="page-subtitle">Detailed ledger of all booked parcel consignments</p>
        </div>
        <button onClick={fetchPackages} className="btn btn-secondary btn-sm">
          🔄 Refresh
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchPackages} />}

      <div className="card">
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by description, type, or package ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Total Packages: {filteredPackages.length}
          </span>
        </div>

        {filteredPackages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>No package items found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Package ID</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Weight (kg)</th>
                  <th>Fragile Handling</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>PKG-#{p.id}</strong>
                    </td>
                    <td>{p.description}</td>
                    <td>
                      <span className="badge badge-picked-up">{p.packageType || 'STANDARD'}</span>
                    </td>
                    <td>{p.weight} kg</td>
                    <td>
                      {p.fragile ? (
                        <span className="badge badge-cancelled">⚠️ Fragile</span>
                      ) : (
                        <span className="badge badge-delivered">Non-Fragile</span>
                      )}
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

export default AdminPackages;
