import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { agentApi } from './Axios';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

export const AgentProfile = () => {
  const { user } = useAuth();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toggling, setToggling] = useState(false);

  const fetchProfile = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const res = await agentApi.get(user.id);
      setAgent(res.data?.data || null);
    } catch (err) {
      setError('Failed to fetch delivery agent profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  const handleToggleAvailability = async () => {
    if (!agent) return;
    setToggling(true);
    try {
      const nextStatus = !agent.availability;
      await agentApi.updateAvailability(agent.id, nextStatus);
      setAgent((prev) => ({ ...prev, availability: nextStatus }));
    } catch (err) {
      alert('Could not update duty availability status');
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <Loader message="Loading agent profile..." />;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Courier Agent Profile</h1>
          <p className="page-subtitle">Personal driver credentials, vehicle assignment, and duty status</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchProfile} />}

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#fff',
            }}
          >
            {agent?.name ? agent.name.charAt(0).toUpperCase() : 'D'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{agent?.name || user?.name}</h2>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', alignItems: 'center' }}>
              <span className="badge badge-picked-up">ROLE_DELIVERY</span>
              <span style={{ fontSize: '0.85rem', color: '#fbbf24' }}>
                ⭐ {agent?.rating != null ? Number(agent.rating).toFixed(1) : '5.0'} Rating
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>AGENT ID</span>
            <strong>#{agent?.id || user?.id}</strong>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>REGISTERED CONTACT PHONE</span>
            <strong>{agent?.contact || user?.username}</strong>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>VEHICLE NUMBER</span>
            <code style={{ color: 'var(--accent-cyan)', fontSize: '1rem' }}>{agent?.vehicleNo || 'Two-Wheeler'}</code>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>CURRENT DUTY STATUS</span>
            <span className={`badge ${agent?.availability ? 'badge-delivered' : 'badge-cancelled'}`} style={{ marginTop: '0.25rem' }}>
              <span className="badge-dot" />
              {agent?.availability ? 'Available for Bookings' : 'Unavailable / In Transit'}
            </span>
          </div>
        </div>

        <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Duty Shift Toggle</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Switch your availability off when taking a break or completing scheduled route maintenance.
          </p>

          <button
            onClick={handleToggleAvailability}
            disabled={toggling}
            className={`btn ${agent?.availability ? 'btn-danger' : 'btn-success'}`}
          >
            {toggling
              ? 'Updating...'
              : agent?.availability
              ? '⏸️ Go Off-Duty (Set Unavailable)'
              : '▶️ Go On-Duty (Set Available)'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
