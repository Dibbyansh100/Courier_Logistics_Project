import React from 'react';
import { useAuth } from '../AuthContext';

export const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Administrator Profile</h1>
          <p className="page-subtitle">System administrator credentials &amp; privileges</p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#fff',
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{user?.name || user?.username || 'Super Admin'}</h2>
            <span className="badge badge-in-transit" style={{ marginTop: '0.35rem' }}>
              Full System Access (ROLE_ADMIN)
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>USER ID</span>
            <strong>#{user?.id || '1'}</strong>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>USERNAME / EMAIL</span>
            <strong>{user?.username || 'admin'}</strong>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>SECURITY PROTOCOL</span>
            <strong>HTTP Basic Auth</strong>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>BACKEND CONNECTION</span>
            <strong style={{ color: 'var(--accent-emerald)' }}>Active (Port 8088)</strong>
          </div>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Assigned Administrative Privileges</h3>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.8' }}>
            <li>Dispatch, re-route, and delete all freight shipments</li>
            <li>Assign and manage delivery fleet personnel &amp; availability</li>
            <li>Manage logistics transit hubs &amp; warehousing capacity</li>
            <li>Inspect and export transaction ledgers &amp; invoices</li>
            <li>Live status check &amp; checkpoint timeline inspection</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
