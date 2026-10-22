import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { warehouseApi } from './Axios';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

export const AdminWarehouseForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    contact: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchWarehouse = async () => {
        try {
          const res = await warehouseApi.get(id);
          const w = res.data?.data;
          if (w) {
            setFormData({
              name: w.name || '',
              location: w.location || '',
              capacity: w.capacity != null ? String(w.capacity) : '',
              contact: w.contact || '',
            });
          }
        } catch (err) {
          setServerError('Failed to load warehouse details');
        } finally {
          setLoading(false);
        }
      };
      fetchWarehouse();
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
    if (!formData.name.trim()) errs.name = 'Warehouse name is required';
    if (!formData.location.trim()) errs.location = 'Location / City is required';
    if (!formData.contact.trim()) {
      errs.contact = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contact.trim())) {
      errs.contact = 'Contact must be 10 digits';
    }
    if (formData.capacity && isNaN(formData.capacity)) {
      errs.capacity = 'Capacity must be a numeric value';
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
        location: formData.location.trim(),
        capacity: formData.capacity ? parseInt(formData.capacity, 10) : 1000,
        contact: formData.contact.trim(),
      };

      if (isEdit) {
        await warehouseApi.update(id, payload);
      } else {
        await warehouseApi.create(payload);
      }
      navigate('/admin/warehouses');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to save warehouse hub. Please check input values.';
      setServerError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading warehouse details..." />;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Warehouse Hub' : 'Add Warehouse Hub'}</h1>
          <p className="page-subtitle">
            {isEdit ? `Update configuration for hub #${id}` : 'Create a new logistics transit hub'}
          </p>
        </div>
        <Link to="/admin/warehouses" className="btn btn-secondary btn-sm">
          ← Back to List
        </Link>
      </div>

      {serverError && <ErrorMessage message={serverError} />}

      <div className="card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Warehouse Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Central Mumbai Hub"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Location / City *</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Mumbai"
              />
              {errors.location && <span className="form-error">{errors.location}</span>}
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
            <label className="form-label">Storage Capacity (Units)</label>
            <input
              type="number"
              name="capacity"
              className="form-control"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="e.g. 5000"
            />
            {errors.capacity && <span className="form-error">{errors.capacity}</span>}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Update Warehouse' : 'Create Warehouse'}
            </button>
            <Link to="/admin/warehouses" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminWarehouseForm;
