import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from './Axios';
import { useAuth } from './AuthContext';
import ErrorMessage from './ErrorMessage';

export const Login = () => {
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
      errs.username = 'Email or phone number is required';
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
        username: username.trim(),
        password: password,
      });

      const resData = response.data;
      if (resData && resData.data) {
        const userData = resData.data;
        // Keep the exact typed identifier (email or phone) for Basic Auth
        userData.loginIdentifier = username.trim();

        // Save in AuthContext and sessionStorage
        login(userData, password);

        // Normalized Role routing
        const role = (userData.role || '').toUpperCase();
        if (role.includes('ADMIN')) {
          navigate('/admin/dashboard', { replace: true });
        } else if (role.includes('DELIVERY') || role.includes('AGENT')) {
          navigate('/agent/dashboard', { replace: true });
        } else {
          navigate('/customer/dashboard', { replace: true });
        }
      } else {
        setServerError(resData.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? 'Invalid username or password'
          : 'Unable to connect to the server. Please check backend is running.');
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* One-Click Home Page Navigator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
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

        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your Logistics &amp; Courier Portal</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email or Phone</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="e.g. user@gmail.com or 9876543210"
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
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Register as Customer
          </Link>
        </div>

        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <Link
            to="/"
            style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <span>🏠</span>
            <span>Return to Home Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
