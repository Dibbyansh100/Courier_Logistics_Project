import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { customerService, warehouseService, shipmentService } from './services';
import { ErrorMessage, Loader } from './components/common';
import { PRICING, PACKAGE_TYPES } from './constants';

export const BookingWizard = ({ isAdmin = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  // Dropdown data
  const [customers, setCustomers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    customerId: !isAdmin && user ? user.id : '',
    sourceCity: '',
    sourceAddress: '',

    // Package details
    packageDescription: '',
    weight: '',
    fragile: false,
    packageType: PACKAGE_TYPES.BOX,

    // Delivery destination & receiver
    receiverName: '',
    receiverPhone: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryPincode: '',
    warehouseId: '',

    // Payment details
    paymentMethod: 'CASH',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadPrerequisites = async () => {
      setFetchingData(true);
      try {
        const promises = [warehouseService.list()];
        if (isAdmin) {
          promises.push(customerService.list());
        }
        const [wRes, cRes] = await Promise.allSettled(promises);

        let warehouseList = [];
        if (wRes.status === 'fulfilled') {
          warehouseList = Array.isArray(wRes.value?.data?.data)
            ? wRes.value.data.data
            : Array.isArray(wRes.value?.data)
            ? wRes.value.data
            : [];
        }

        // Fallback matching the 14 seeded warehouses on Render
        if (warehouseList.length === 0) {
          warehouseList = [
            { id: 1, name: 'Bengaluru Central Hub', location: 'Bengaluru', capacity: 8000 },
            { id: 2, name: 'Mumbai Distribution Center', location: 'Mumbai', capacity: 12000 },
            { id: 3, name: 'Delhi NCR Logistics Park', location: 'Delhi', capacity: 15000 },
            { id: 4, name: 'Chennai Transit Terminal', location: 'Chennai', capacity: 7500 },
            { id: 5, name: 'Hyderabad Sorting Facility', location: 'Hyderabad', capacity: 9000 },
            { id: 6, name: 'Pune Regional Cargo Depot', location: 'Pune', capacity: 6000 },
            { id: 7, name: 'Bangalore Central Warehouse', location: 'Electronic City, Bangalore, Karnataka', capacity: 15000 },
            { id: 8, name: 'Delhi Distribution Center', location: 'Okhla Industrial Area, New Delhi', capacity: 20000 },
            { id: 9, name: 'Mumbai Storage Hub', location: 'Andheri East, Mumbai, Maharashtra', capacity: 12000 },
            { id: 10, name: 'Pune Logistics Warehouse', location: 'Hinjewadi Phase 2, Pune, Maharashtra', capacity: 8500 },
            { id: 11, name: 'Hyderabad Supply Center', location: 'Gachibowli, Hyderabad, Telangana', capacity: 18000 },
            { id: 12, name: 'Chennai Goods Warehouse', location: 'Ambattur Industrial Estate, Chennai, Tamil Nadu', capacity: 10000 },
            { id: 13, name: 'Jaipur Storage Facility', location: 'Sitapura Industrial Area, Jaipur, Rajasthan', capacity: 7500 },
            { id: 14, name: 'Kolkata Freight Warehouse', location: 'Dankuni, Kolkata, West Bengal', capacity: 14000 },
          ];
        }

        setWarehouses(warehouseList);

        if (isAdmin && cRes && cRes.status === 'fulfilled') {
          const customerList = Array.isArray(cRes.value?.data?.data)
            ? cRes.value.data.data
            : Array.isArray(cRes.value?.data)
            ? cRes.value.data
            : [];
          setCustomers(customerList);
          if (customerList.length > 0 && !formData.customerId) {
            setFormData((prev) => ({ ...prev, customerId: String(customerList[0].id) }));
          }
        }
      } catch (err) {
        console.warn('Prerequisites loading caught error', err);
      } finally {
        setFetchingData(false);
      }
    };

    loadPrerequisites();
  }, [isAdmin]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    if (name === 'packageType') {
      const isFragileSelection =
        value === 'FRAGILE_BOX' || value === 'FRAGILE_ELECTRONICS' || value === 'FRAGILE';
      setFormData((prev) => ({
        ...prev,
        packageType: value,
        fragile: isFragileSelection ? true : prev.fragile,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: val }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Calculations
  const calculatedWeight = parseFloat(formData.weight) || 0;
  const baseCost = calculatedWeight * PRICING.RATE_PER_KG;
  const fragileCost = formData.fragile ? PRICING.FRAGILE_SURCHARGE : 0;
  const totalEstimatedAmount = baseCost + fragileCost;

  // Multi-step Validation
  const validateStep = (step) => {
    const nextErrors = {};
    if (step === 1) {
      if (isAdmin && !formData.customerId) {
        nextErrors.customerId = 'Please select a customer';
      }
      if (!formData.sourceCity.trim()) {
        nextErrors.sourceCity = 'Source city is required';
      }
      if (!formData.sourceAddress.trim()) {
        nextErrors.sourceAddress = 'Pickup address is required';
      }
    } else if (step === 2) {
      if (!formData.packageDescription.trim()) {
        nextErrors.packageDescription = 'Package description is required';
      }
      if (!formData.weight || parseFloat(formData.weight) <= 0) {
        nextErrors.weight = 'Weight must be greater than 0 kg';
      }
      if (!formData.packageType) {
        nextErrors.packageType = 'Package type is required';
      }
    } else if (step === 3) {
      if (!formData.receiverName.trim()) {
        nextErrors.receiverName = 'Receiver name is required';
      }
      if (!formData.receiverPhone.trim()) {
        nextErrors.receiverPhone = 'Receiver phone is required';
      } else if (!/^\d{10}$/.test(formData.receiverPhone.trim())) {
        nextErrors.receiverPhone = 'Phone must be exactly 10 digits';
      }
      if (!formData.deliveryAddress.trim()) {
        nextErrors.deliveryAddress = 'Delivery address is required';
      }
      if (!formData.deliveryCity.trim()) {
        nextErrors.deliveryCity = 'City is required';
      }
      if (!formData.deliveryPincode.trim()) {
        nextErrors.deliveryPincode = 'Pincode is required';
      } else if (!/^\d{6}$/.test(formData.deliveryPincode.trim())) {
        nextErrors.deliveryPincode = 'Pincode must be exactly 6 digits';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setErrorMessage('');
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setErrorMessage('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitBooking = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const destinationFull = `${formData.deliveryAddress.trim()}, ${formData.deliveryCity.trim()} - ${formData.deliveryPincode.trim()}`;
      const sourceFull = `${formData.sourceAddress.trim()}, ${formData.sourceCity.trim()}`;
      const selectedCustomerId = isAdmin ? Number(formData.customerId) : Number(user.id);

      // Map UI package selection to backend supported enum [BOX, PARCEL, ENVELOPE]
      let backendPackageType = PACKAGE_TYPES.BOX;
      let isFragile = Boolean(formData.fragile);

      if (formData.packageType === PACKAGE_TYPES.ENVELOPE) {
        backendPackageType = PACKAGE_TYPES.ENVELOPE;
      } else if (formData.packageType === PACKAGE_TYPES.PARCEL) {
        backendPackageType = PACKAGE_TYPES.PARCEL;
      } else if (
        formData.packageType === 'FRAGILE_ELECTRONICS' ||
        formData.packageType === 'FRAGILE_BOX' ||
        formData.packageType === 'FRAGILE'
      ) {
        backendPackageType = PACKAGE_TYPES.BOX;
        isFragile = true;
      } else {
        backendPackageType = PACKAGE_TYPES.BOX;
      }

      const payload = {
        source: sourceFull,
        destination: destinationFull,
        weight: calculatedWeight,
        customer: { id: selectedCustomerId },
        warehouse: formData.warehouseId ? { id: Number(formData.warehouseId) } : null,
        packageEntity: {
          description: formData.packageDescription.trim(),
          weight: calculatedWeight,
          fragile: isFragile,
          packageType: backendPackageType,
        },
        payment: {
          amount: totalEstimatedAmount,
          paymentMethod: formData.paymentMethod || 'CASH',
          paymentStatus: 'PENDING',
        },
      };

      const res = await shipmentService.create(payload);
      const createdShipment = res.data?.data || res.data;
      setSuccessInfo(createdShipment);
    } catch (err) {
      const errorText =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Booking failed. Please verify customer, warehouse, and network connection.';
      setErrorMessage(errorText);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return <Loader message="Loading booking form prerequisites..." />;
  }

  if (successInfo) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Shipment Booked Successfully!
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Your package has been registered and is queued for transit processing.
        </p>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
            maxWidth: '460px',
            margin: '0 auto 2rem',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            Tracking Number
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>
            {successInfo.trackingNumber || 'TRK-PENDING'}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.5rem' }}>
            Estimated Amount: <strong>₹{successInfo.payment?.amount || totalEstimatedAmount}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => {
              setSuccessInfo(null);
              setCurrentStep(1);
            }}
            className="btn btn-secondary"
          >
            Book Another Shipment
          </button>
          <button
            type="button"
            onClick={() => {
              if (isAdmin) {
                navigate(`/admin/shipments/${successInfo.id || ''}`);
              } else {
                navigate(`/customer/shipments/${successInfo.id || ''}`);
              }
            }}
            className="btn btn-primary"
          >
            View Shipment Details
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Customer' },
    { num: 2, label: 'Package' },
    { num: 3, label: 'Delivery' },
    { num: 4, label: 'Review' },
    { num: 5, label: 'Submit' },
  ];

  return (
    <div className="card">
      {/* Progress Stepper */}
      <div className="wizard-stepper">
        {steps.map((s) => (
          <div
            key={s.num}
            className={`step-node ${currentStep === s.num ? 'active' : ''} ${
              currentStep > s.num ? 'completed' : ''
            }`}
          >
            <div className="step-circle">{currentStep > s.num ? '✓' : s.num}</div>
            <span className="step-label">{s.label}</span>
          </div>
        ))}
      </div>

      {errorMessage && (
        <div style={{ marginBottom: '1.5rem' }}>
          <ErrorMessage message={errorMessage} />
        </div>
      )}

      {/* Step 1: Customer */}
      {currentStep === 1 && (
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>
            Step 1: Customer &amp; Pickup Origin
          </h3>

          {isAdmin ? (
            <div className="form-group">
              <label className="form-label" htmlFor="booking-customer-select">
                Select Customer *
              </label>
              <select
                id="booking-customer-select"
                name="customerId"
                className="form-control"
                value={formData.customerId}
                onChange={handleChange}
              >
                <option value="">-- Choose Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email} | {c.contact})
                  </option>
                ))}
              </select>
              {errors.customerId && <span className="form-error">{errors.customerId}</span>}
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label" htmlFor="booking-customer-name">
                Booking Customer
              </label>
              <input
                id="booking-customer-name"
                type="text"
                className="form-control"
                value={`${user?.name || ''} (${user?.username || ''})`}
                disabled
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                Shipment is linked to your verified account.
              </span>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="booking-source-city">
                Source City *
              </label>
              <input
                id="booking-source-city"
                type="text"
                name="sourceCity"
                className="form-control"
                placeholder="e.g. Mumbai, Delhi, Bengaluru"
                value={formData.sourceCity}
                onChange={handleChange}
              />
              {errors.sourceCity && <span className="form-error">{errors.sourceCity}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="booking-source-address">
                Pickup Address *
              </label>
              <input
                id="booking-source-address"
                type="text"
                name="sourceAddress"
                className="form-control"
                placeholder="Street / Warehouse Pickup point"
                value={formData.sourceAddress}
                onChange={handleChange}
              />
              {errors.sourceAddress && <span className="form-error">{errors.sourceAddress}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Package */}
      {currentStep === 2 && (
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>
            Step 2: Package Specifications
          </h3>

          <div className="form-group">
            <label className="form-label" htmlFor="booking-pkg-desc">
              Package Description *
            </label>
            <input
              id="booking-pkg-desc"
              type="text"
              name="packageDescription"
              className="form-control"
              placeholder="e.g. Electronics, Books, Spare Parts"
              value={formData.packageDescription}
              onChange={handleChange}
            />
            {errors.packageDescription && (
              <span className="form-error">{errors.packageDescription}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="booking-pkg-weight">
                Weight (in kg) *
              </label>
              <input
                id="booking-pkg-weight"
                type="number"
                step="0.1"
                min="0.1"
                name="weight"
                className="form-control"
                placeholder="e.g. 2.5"
                value={formData.weight}
                onChange={handleChange}
              />
              {errors.weight && <span className="form-error">{errors.weight}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="booking-pkg-type">
                Package Type *
              </label>
              <select
                id="booking-pkg-type"
                name="packageType"
                className="form-control"
                value={formData.packageType}
                onChange={handleChange}
              >
                <option value="BOX">Standard Box</option>
                <option value="FRAGILE_BOX">Fragile Package (Glass / Delicate Goods)</option>
                <option value="FRAGILE_ELECTRONICS">Fragile Electronics (Laptops / Devices)</option>
                <option value="PARCEL">General Parcel</option>
                <option value="ENVELOPE">Envelope / Document</option>
              </select>
              {errors.packageType && <span className="form-error">{errors.packageType}</span>}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-checkbox">
              <input
                type="checkbox"
                name="fragile"
                checked={formData.fragile}
                onChange={handleChange}
              />
              <span>
                Fragile package (requires careful handling, adds ₹{PRICING.FRAGILE_SURCHARGE} flat surcharge)
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Step 3: Delivery */}
      {currentStep === 3 && (
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>
            Step 3: Receiver &amp; Delivery Destination
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="booking-receiver-name">
                Receiver Name *
              </label>
              <input
                id="booking-receiver-name"
                type="text"
                name="receiverName"
                className="form-control"
                placeholder="Receiver's full name"
                value={formData.receiverName}
                onChange={handleChange}
              />
              {errors.receiverName && (
                <span className="form-error">{errors.receiverName}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="booking-receiver-phone">
                Receiver Phone * (10 digits)
              </label>
              <input
                id="booking-receiver-phone"
                type="tel"
                maxLength="10"
                name="receiverPhone"
                className="form-control"
                placeholder="10 digit contact"
                value={formData.receiverPhone}
                onChange={handleChange}
              />
              {errors.receiverPhone && (
                <span className="form-error">{errors.receiverPhone}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="booking-delivery-addr">
              Delivery Street Address *
            </label>
            <input
              id="booking-delivery-addr"
              type="text"
              name="deliveryAddress"
              className="form-control"
              placeholder="Building, street, landmark"
              value={formData.deliveryAddress}
              onChange={handleChange}
            />
            {errors.deliveryAddress && (
              <span className="form-error">{errors.deliveryAddress}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="booking-delivery-city">
                City *
              </label>
              <input
                id="booking-delivery-city"
                type="text"
                name="deliveryCity"
                className="form-control"
                placeholder="Destination City"
                value={formData.deliveryCity}
                onChange={handleChange}
              />
              {errors.deliveryCity && (
                <span className="form-error">{errors.deliveryCity}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="booking-delivery-pincode">
                Pincode * (6 digits)
              </label>
              <input
                id="booking-delivery-pincode"
                type="text"
                maxLength="6"
                name="deliveryPincode"
                className="form-control"
                placeholder="6 digit pincode"
                value={formData.deliveryPincode}
                onChange={handleChange}
              />
              {errors.deliveryPincode && (
                <span className="form-error">{errors.deliveryPincode}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="booking-warehouse-select">
              Routing Warehouse Hub &amp; Location (Optional)
            </label>
            <select
              id="booking-warehouse-select"
              name="warehouseId"
              className="form-control"
              value={formData.warehouseId}
              onChange={handleChange}
            >
              <option value="">-- Direct Delivery / Auto-Assign Hub (Optional) --</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  📍 {w.location} — {w.name} (Capacity: {w.capacity || 'Standard'})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {currentStep === 4 && (
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>
            Step 4: Review Booking &amp; Cost Estimation
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
              }}
            >
              <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                📍 Route &amp; Receiver
              </h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <strong>Origin:</strong> {formData.sourceAddress}, {formData.sourceCity}
              </p>
              <p style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <strong>Destination:</strong> {formData.deliveryAddress}, {formData.deliveryCity} - {formData.deliveryPincode}
              </p>
              <p style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <strong>Receiver:</strong> {formData.receiverName} ({formData.receiverPhone})
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                <strong>Hub:</strong>{' '}
                {warehouses.find((w) => String(w.id) === String(formData.warehouseId))?.name ||
                  'Direct Delivery / Auto-Assign'}
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
              }}
            >
              <h4 style={{ color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                📦 Package Details
              </h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <strong>Description:</strong> {formData.packageDescription}
              </p>
              <p style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <strong>Type:</strong>{' '}
                {formData.packageType === 'FRAGILE_BOX'
                  ? 'Fragile Package'
                  : formData.packageType === 'FRAGILE_ELECTRONICS'
                  ? 'Fragile Electronics'
                  : formData.packageType === 'ENVELOPE'
                  ? 'Envelope / Document'
                  : formData.packageType === 'PARCEL'
                  ? 'General Parcel'
                  : 'Standard Box'}
              </p>
              <p style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <strong>Weight:</strong> {calculatedWeight} kg
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                <strong>Fragile Handling:</strong> {formData.fragile ? 'Yes (+₹100)' : 'No'}
              </p>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
            }}
          >
            <h4 style={{ color: '#fff', marginBottom: '0.75rem', fontSize: '1rem' }}>
              💰 Cost Breakdown
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
              <span>Base Freight ({calculatedWeight} kg × ₹{PRICING.RATE_PER_KG}/kg):</span>
              <span>₹{baseCost.toFixed(2)}</span>
            </div>
            {formData.fragile && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--accent-amber)' }}>
                <span>Fragile Handling Surcharge:</span>
                <span>₹{fragileCost.toFixed(2)}</span>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.2rem',
                fontWeight: 700,
                marginTop: '0.75rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--accent-emerald)',
              }}
            >
              <span>Total Estimated Amount:</span>
              <span>₹{totalEstimatedAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Submit */}
      {currentStep === 5 && (
        <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
            Ready to Confirm Booking
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Please click "Confirm &amp; Book Shipment" below to dispatch the booking to the backend.
            All rules for customer, warehouse, and availability will be verified.
          </p>

          <div className="form-group" style={{ maxWidth: '300px', margin: '0 auto 1.5rem', textAlign: 'left' }}>
            <label className="form-label" htmlFor="booking-payment-method">
              Payment Preference
            </label>
            <select
              id="booking-payment-method"
              name="paymentMethod"
              className="form-control"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="CASH">Cash on Delivery (COD)</option>
              <option value="CARD">Credit / Debit Card</option>
              <option value="UPI">UPI / Net Banking</option>
            </select>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="wizard-nav">
        {currentStep > 1 ? (
          <button type="button" onClick={handleBack} className="btn btn-secondary">
            ← Back
          </button>
        ) : (
          <div />
        )}

        {currentStep < 5 ? (
          <button type="button" onClick={handleNext} className="btn btn-primary">
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitBooking}
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '0.7rem 2rem' }}
          >
            {loading ? 'Validating & Booking...' : 'Confirm & Book Shipment'}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingWizard;
