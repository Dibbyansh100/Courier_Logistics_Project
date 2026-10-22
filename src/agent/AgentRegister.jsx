import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { agentApi } from '../Axios';
import ErrorMessage from '../ErrorMessage';

export const AgentRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    vehicleNo: '',
    password: '',
    confirmPassword: '',
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
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.contact.trim()) {
      errs.contact = 'Contact phone number is required';
    } else if (!/^\d{10}$/.test(formData.contact.trim())) {
      errs.contact = 'Phone must be exactly 10 digits';
    }
    if (!formData.vehicleNo.trim()) {
      errs.vehicleNo = 'Vehicle registration number is required (e.g. MH-02-AB-1234)';
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
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        vehicleNo: formData.vehicleNo.trim().toUpperCase(),
        password: formData.password,
        rating: 5.0,
        availability: true,
        role: 'ROLE_DELIVERY',
      };

      await agentApi.create(payload);
      setSuccessMessage('Delivery Agent enrolled successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/agent/login');
      }, 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Agent registration failed. Ensure contact phone is not already in use.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🚴</div>
          <span className="badge badge-picked-up" style={{ marginBottom: '0.75rem' }}>
            DELIVERY FLEET PORTAL
          </span>
          <h1 className="auth-title">Agent Registration</h1>
          <p className="auth-subtitle">Enroll as a certified delivery courier and start taking delivery routes</p>
        </div>

        {serverError && <ErrorMessage message={serverError} />}
        {successMessage && (
          <div className="badge badge-delivered" style={{ display: 'block', padding: '0.8rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. Amit Patil"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contact Phone (10 Digits) *</label>
              <input
                type="tel"
                name="contact"
                maxLength="10"
                className="form-control"
                placeholder="9876543210"
                value={formData.contact}
                onChange={handleChange}
              />
              {errors.contact && <span className="form-error">{errors.contact}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Vehicle Registration No. *</label>
              <input
                type="text"
                name="vehicleNo"
                className="form-control"
                placeholder="MH-02-AB-1234"
                value={formData.vehicleNo}
                onChange={handleChange}
              />
              {errors.vehicleNo && <span className="form-error">{errors.vehicleNo}</span>}
            </div>
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

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '0.75rem', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
          >
            {loading ? 'Registering Agent...' : 'Join Delivery Fleet'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an agent account?{' '}
          <Link to="/agent/login" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
            Sign In to Agent Portal
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

export default AgentRegister;
