import React from 'react';
import { Link } from 'react-router-dom';
import { useLoginForm } from './hooks/useLoginForm';
import { ErrorMessage } from './components/common';

export const Login = () => {
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

        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your Logistics &amp; Courier Portal</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-identifier">
              Email or Phone
            </label>
            <input
              id="login-identifier"
              type="text"
              name="username"
              className="form-control"
              placeholder="e.g. john@example.com or 9876543210"
              value={username}
              onChange={handleUsernameChange}
              autoComplete="username"
            />
            {errors.username && <span className="form-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
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
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Register as Customer
          </Link>
        </div>

        {/* Portal Shortcuts */}
        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-around',
            fontSize: '0.8rem',
          }}
        >
          <Link to="/agent/login" style={{ color: 'var(--text-muted)' }}>
            Agent Portal
          </Link>
          <span style={{ color: 'var(--border-color)' }}>•</span>
          <Link to="/admin/login" style={{ color: 'var(--text-muted)' }}>
            Admin Portal
          </Link>
          <span style={{ color: 'var(--border-color)' }}>•</span>
          <Link to="/customer/login" style={{ color: 'var(--text-muted)' }}>
            Customer Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
