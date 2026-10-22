import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../Axios';
import ErrorMessage from '../ErrorMessage';

export const AdminRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminPasskey: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) errs.username = 'Admin username is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Valid email address is required';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (!formData.adminPasskey.trim()) {
      errs.adminPasskey = 'Master admin passkey is required for security clearance';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: 'ROLE_ADMIN',
      };

      await userApi.create(payload);
      setSuccessMessage('Administrator account generated! Redirecting to admin sign in...');
      setTimeout(() => {
        navigate('/admin/login');
      }, 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to register admin user. Ensure username/email is not already taken.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛡️</div>
          <span className="badge badge-cancelled" style={{ marginBottom: '0.75rem' }}>
            OPERATIONS &amp; ADMIN PORTAL
          </span>
          <h1 className="auth-title">Admin Registration</h1>
          <p className="auth-subtitle">Provision system administrative credentials with operations clearance</p>
        </div>

        {serverError && <ErrorMessage message={serverError} />}
        {successMessage && (
          <div className="badge badge-delivered" style={{ display: 'block', padding: '0.8rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Admin Username *</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="e.g. admin_hq"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <span className="form-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Official Work Email *</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="admin@logistics.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password * (min 6 characters)</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="••••••"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Master Organization Passkey *</label>
            <input
              type="password"
              name="adminPasskey"
              className="form-control"
              placeholder="Internal organizational clearance key"
              value={formData.adminPasskey}
              onChange={handleChange}
            />
            {errors.adminPasskey && <span className="form-error">{errors.adminPasskey}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '0.75rem', background: 'linear-gradient(135deg, #f43f5e, #be123c)' }}
          >
            {loading ? 'Authorizing & Creating...' : 'Register Administrator'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an administrator account?{' '}
          <Link to="/admin/login" style={{ color: '#fda4af', fontWeight: 600 }}>
            Sign In to Admin Portal
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

export default AdminRegister;
