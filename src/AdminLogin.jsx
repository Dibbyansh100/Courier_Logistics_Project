import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from './Axios';
import { useAuth } from './AuthContext';
import ErrorMessage from './ErrorMessage';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!username.trim()) {
      errs.username = 'Admin username or email is required';
    }
    if (!password) {
      errs.password = 'Admin password is required';
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
        username: username.trim(),
        password: password,
      });

      const resData = response.data;
      if (resData && resData.data) {
        const userData = resData.data;
        userData.loginIdentifier = username.trim();
        login(userData, password);

        const role = (userData.role || '').toUpperCase();
        if (role.includes('ADMIN')) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          setServerError('Account authenticated, but does not possess ROLE_ADMIN permissions.');
        }
      } else {
        setServerError(resData.message || 'Authentication failed. Please verify admin credentials.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? 'Invalid administrator username or password'
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
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛡️</div>
          <span className="badge badge-cancelled" style={{ marginBottom: '0.75rem' }}>
            OPERATIONS &amp; ADMIN PORTAL
          </span>
          <h1 className="auth-title">Admin Sign In</h1>
          <p className="auth-subtitle">Restricted operations access for dispatchers &amp; logistics managers</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Administrator Username / Email</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="e.g. admin or manager@logistics.com"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors((prev) => ({ ...prev, username: '' }));
              }}
            />
            {errors.username && <span className="form-error">{errors.username}</span>}
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
            style={{ marginTop: '1rem', background: 'linear-gradient(135deg, #f43f5e, #be123c)' }}
          >
            {loading ? 'Validating Security Credentials...' : 'Sign In to Operations Console'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Create another administrator?{' '}
          <Link to="/admin/register" style={{ color: '#fda4af', fontWeight: 600 }}>
            Register Admin Account
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

export default AdminLogin;
