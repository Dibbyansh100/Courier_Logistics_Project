import React from 'react';
import { Link } from 'react-router-dom';
import { useLoginForm } from '../hooks/useLoginForm';
import { ErrorMessage } from '../components/common';
import { ROLES } from '../constants';

export const CustomerLogin = () => {
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
    requiredRole: ROLES.CUSTOMER,
    successRedirect: '/customer/dashboard',
    roleMismatchError: 'Account authenticated, but does not possess ROLE_CUSTOMER permissions.',
    usernameRequiredMsg: 'Email or phone number is required',
  });

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Navigation Bar */}
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

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👤</div>
          <span className="badge badge-picked-up" style={{ marginBottom: '0.75rem' }}>
            CUSTOMER CLIENT PORTAL
          </span>
          <h1 className="auth-title">Customer Sign In</h1>
          <p className="auth-subtitle">Access your consignments, order invoices &amp; live parcel tracking</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="customer-username">
              Customer Email or Phone
            </label>
            <input
              id="customer-username"
              type="text"
              name="username"
              className="form-control"
              placeholder="e.g. yourname@gmail.com or 9876543210"
              value={username}
              onChange={handleUsernameChange}
              autoComplete="username"
            />
            {errors.username && <span className="form-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="customer-password">
              Password
            </label>
            <input
              id="customer-password"
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
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In to Customer Hub'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          New customer?{' '}
          <Link to="/customer/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Create Customer Account
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

export default CustomerLogin;
