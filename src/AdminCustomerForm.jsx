import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { customerApi } from './Axios';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

export const AdminCustomerForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchCustomer = async () => {
        try {
          const res = await customerApi.get(id);
          const c = res.data?.data;
          if (c) {
            setFormData({
              name: c.name || '',
              email: c.email || '',
              contact: c.contact || '',
              address: c.address || '',
              password: '',
            });
          }
        } catch (err) {
          setServerError('Failed to load customer details');
        } finally {
          setLoading(false);
        }
      };
      fetchCustomer();
    }
  }, [id, isEdit]);

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
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Valid email is required';
    }
    if (!formData.contact.trim()) {
      errs.contact = 'Contact is required';
    } else if (!/^\d{10}$/.test(formData.contact.trim())) {
      errs.contact = 'Contact must be 10 digits';
    }
    if (!formData.address.trim()) errs.address = 'Address is required';

    if (!isEdit && !formData.password) {
      errs.password = 'Password is required for new customers';
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
        email: formData.email.trim(),
        contact: formData.contact.trim(),
        address: formData.address.trim(),
        role: 'ROLE_CUSTOMER',
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      if (isEdit) {
        await customerApi.update(id, payload);
      } else {
        await customerApi.create(payload);
      }
      navigate('/admin/customers');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to save customer. Please check unique email/contact rules.';
      setServerError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading customer record..." />;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Customer' : 'Add New Customer'}</h1>
          <p className="page-subtitle">
            {isEdit ? `Update profile for customer #${id}` : 'Create a new customer account'}
          </p>
        </div>
        <Link to="/admin/customers" className="btn btn-secondary btn-sm">
          ← Back to List
        </Link>
      </div>

      {serverError && <ErrorMessage message={serverError} />}

      <div className="card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Customer Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ramesh Kumar"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="customer@domain.com"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Contact (10 Digits) *</label>
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
          </div>

          <div className="form-group">
            <label className="form-label">Address *</label>
            <textarea
              name="address"
              className="form-control"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street, City, Pincode"
            />
            {errors.address && <span className="form-error">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              {isEdit ? 'Password (leave blank to keep unchanged)' : 'Password * (min 6 characters)'}
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
              {saving ? 'Saving...' : isEdit ? 'Update Customer' : 'Create Customer'}
            </button>
            <Link to="/admin/customers" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCustomerForm;
