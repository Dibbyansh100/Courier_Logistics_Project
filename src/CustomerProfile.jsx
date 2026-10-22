import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { customerApi } from './Axios';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

export const CustomerProfile = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const res = await customerApi.get(user.id);
        const c = res.data?.data;
        if (c) {
          setFormData({
            name: c.name || '',
            email: c.email || '',
            contact: c.contact || '',
            address: c.address || '',
          });
        }
      } catch (err) {
        setError('Failed to fetch profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!/^\d{10}$/.test(formData.contact.trim())) {
      setError('Contact must be exactly 10 digits');
      return;
    }

    setSaving(true);
    try {
      await customerApi.update(user.id, {
        ...formData,
        role: 'ROLE_CUSTOMER',
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading profile..." />;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Profile</h1>
          <p className="page-subtitle">Manage your personal shipping address and contact credentials</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}
      {success && (
        <div className="badge badge-delivered" style={{ display: 'block', padding: '0.8rem', marginBottom: '1.25rem', textAlign: 'center' }}>
          {success}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email (Account identifier)</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                disabled
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                Email cannot be modified.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Contact (10 Digits)</label>
              <input
                type="tel"
                maxLength="10"
                name="contact"
                className="form-control"
                value={formData.contact}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Default Shipping Address</label>
            <textarea
              name="address"
              className="form-control"
              rows="3"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: '0.5rem' }}>
            {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerProfile;
