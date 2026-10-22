import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from './Axios';
import { useAuth } from './AuthContext';
import ErrorMessage from './ErrorMessage';

export const AgentLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!contact.trim()) {
      errs.contact = 'Agent contact phone number is required';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authApi.login({
        username: contact.trim(),
        password: password,
      });

      const resData = response.data;
      if (resData && resData.data) {
        const userData = resData.data;
        userData.loginIdentifier = contact.trim();
        login(userData, password);

        const role = (userData.role || '').toUpperCase();
        if (role.includes('DELIVERY') || role.includes('AGENT')) {
          navigate('/agent/dashboard', { replace: true });
        } else if (role.includes('ADMIN')) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/customer/dashboard', { replace: true });
        }
      } else {
        setServerError(resData.message || 'Login failed. Please verify credentials.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? 'Invalid Delivery Agent contact number or password'
          : 'Unable to connect to the backend server (port 8088).');
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* One-Click Home Page Navigator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <Link
            to="/"
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.4rem 0.85rem' }}
            title="Navigate to Home Page"
          >
            <span style={{ fontSize: '1rem' }}>🏠</span>
            <span>Back to Home</span>
          </Link>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>LogiTrack Hub</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛵</div>
          <span className="badge badge-picked-up" style={{ marginBottom: '0.75rem' }}>
            DELIVERY FLEET PORTAL
          </span>
          <h1 className="auth-title">Agent Sign In</h1>
          <p className="auth-subtitle">Access your assigned delivery tasks, route navigation &amp; drop-offs</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Agent Contact Phone (10 Digits)</label>
            <input
              type="tel"
              name="contact"
              maxLength="10"
              className="form-control"
              placeholder="e.g. 9876543210"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                if (errors.contact) setErrors((prev) => ({ ...prev, contact: '' }));
              }}
            />
            {errors.contact && <span className="form-error">{errors.contact}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {serverError && <ErrorMessage message={serverError} />}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '1rem', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
          >
            {loading ? 'Verifying Fleet Credentials...' : 'Sign In as Delivery Agent'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Need to join the fleet?{' '}
          <Link to="/agent/register" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
            Register as Delivery Agent
          </Link>
        </div>

        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '0.8rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>
            ← Back to Logistics Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AgentLogin;
