import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { agentApi } from './Axios';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

export const AdminAgentForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    vehicleNo: '',
    rating: '5.0',
    availability: true,
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchAgent = async () => {
        try {
          const res = await agentApi.get(id);
          const a = res.data?.data;
          if (a) {
            setFormData({
              name: a.name || '',
              contact: a.contact || '',
              vehicleNo: a.vehicleNo || '',
              rating: a.rating != null ? String(a.rating) : '5.0',
              availability: a.availability !== false,
              password: '',
            });
          }
        } catch (err) {
          setServerError('Failed to load delivery agent details');
        } finally {
          setLoading(false);
        }
      };
      fetchAgent();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Agent name is required';
    if (!formData.contact.trim()) {
      errs.contact = 'Contact phone is required';
    } else if (!/^\d{10}$/.test(formData.contact.trim())) {
      errs.contact = 'Contact must be exactly 10 digits';
    }
    if (!formData.vehicleNo.trim()) {
      errs.vehicleNo = 'Vehicle number is required';
    }
    if (!formData.rating || isNaN(formData.rating) || Number(formData.rating) < 0 || Number(formData.rating) > 5) {
      errs.rating = 'Rating must be between 0.0 and 5.0';
    }

    if (!isEdit && !formData.password) {
      errs.password = 'Password is required for login';
    } else if (formData.password && formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        vehicleNo: formData.vehicleNo.trim().toUpperCase(),
        rating: parseFloat(formData.rating),
        availability: Boolean(formData.availability),
        role: 'ROLE_DELIVERY',
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      if (isEdit) {
        await agentApi.update(id, payload);
      } else {
        await agentApi.create(payload);
      }
      navigate('/admin/agents');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to save delivery agent. Ensure contact number is unique.';
      setServerError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading agent details..." />;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Delivery Agent' : 'Add Delivery Agent'}</h1>
          <p className="page-subtitle">
            {isEdit ? `Update credentials for agent #${id}` : 'Enroll a new courier driver'}
          </p>
        </div>
        <Link to="/admin/agents" className="btn btn-secondary btn-sm">
          ← Back to List
        </Link>
      </div>

      {serverError && <ErrorMessage message={serverError} />}

      <div className="card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Amit Patil"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contact Number (10 Digits) *</label>
              <input
                type="tel"
                maxLength="10"
                name="contact"
                className="form-control"
                value={formData.contact}
                onChange={handleChange}
                placeholder="9876543210"
              />
              {errors.contact && <span className="form-error">{errors.contact}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Vehicle Registration No. *</label>
              <input
                type="text"
                name="vehicleNo"
                className="form-control"
                value={formData.vehicleNo}
                onChange={handleChange}
                placeholder="e.g. MH-02-AB-1234"
              />
              {errors.vehicleNo && <span className="form-error">{errors.vehicleNo}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Rating (0 - 5.0) *</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="rating"
                className="form-control"
                value={formData.rating}
                onChange={handleChange}
              />
              {errors.rating && <span className="form-error">{errors.rating}</span>}
            </div>

            <div className="form-group" style={{ justifyContent: 'center' }}>
              <label className="form-label">Fleet Status</label>
              <label className="form-checkbox" style={{ marginTop: '0.4rem' }}>
                <input
                  type="checkbox"
                  name="availability"
                  checked={formData.availability}
                  onChange={handleChange}
                />
                <span>Available for Delivery Duty</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              {isEdit ? 'Password (leave blank to keep unchanged)' : 'Login Password * (min 6 characters)'}
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Update Agent' : 'Create Agent'}
            </button>
            <Link to="/admin/agents" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAgentForm;
