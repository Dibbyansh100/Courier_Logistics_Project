import React from 'react';
import { Link } from 'react-router-dom';
import { useLoginForm } from '../hooks/useLoginForm';
import { ErrorMessage } from '../components/common';
import { ROLES } from '../constants';

export const AdminLogin = () => {
  const {
    username,
    password,
    errors,
    serverError,
    loading,
    handleUsernameChange,
    handlePasswordChange,
    handleSubmit,
  } = useLoginForm({
    requiredRole: ROLES.ADMIN,
    successRedirect: '/admin/dashboard',
    roleMismatchError: 'Account authenticated, but does not possess ROLE_ADMIN permissions.',
    usernameRequiredMsg: 'Admin username or email is required',
  });

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Navigation Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <Link
            to="/"
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.4rem 0.85rem' }}
            title="Navigate to Home Page"
          >
            <span style={{ fontSize: '1rem' }}></span>
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
            <label className="form-label" htmlFor="admin-username">
              Administrator Username / Email
            </label>
            <input
              id="admin-username"
              type="text"
              name="username"
              className="form-control"
              placeholder="e.g. admin or manager@logistics.com"
              value={username}
              onChange={handleUsernameChange}
              autoComplete="username"
            />
            {errors.username && <span className="form-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              name="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
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
