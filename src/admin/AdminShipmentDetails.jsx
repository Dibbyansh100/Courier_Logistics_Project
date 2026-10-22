import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { shipmentApi, agentApi, warehouseApi } from '../Axios';
import Loader from '../Loader';
import ErrorMessage from '../ErrorMessage';
import StatusBadge from '../StatusBadge';

export const AdminShipmentDetails = () => {
  const { id } = useParams();

  const [shipment, setShipment] = useState(null);
  const [agents, setAgents] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');

  const [loading, setLoading] = useState(true);
  const [assigningAgent, setAssigningAgent] = useState(false);
  const [assigningWarehouse, setAssigningWarehouse] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const [sRes, aRes, wRes] = await Promise.all([
        shipmentApi.getById(id),
        agentApi.list(),
        warehouseApi.list(),
      ]);

      const s = sRes.data?.data;
      setShipment(s);
      if (s?.deliveryAgent?.id) setSelectedAgentId(String(s.deliveryAgent.id));
      if (s?.warehouse?.id) setSelectedWarehouseId(String(s.warehouse.id));

      setAgents(aRes.data?.data || []);
      setWarehouses(wRes.data?.data || []);
    } catch (err) {
      setErrorMessage('Failed to load shipment details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAssignAgent = async () => {
    if (!selectedAgentId) return;
    setAssigningAgent(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await shipmentApi.assignAgent(id, selectedAgentId);
      setShipment(res.data?.data || shipment);
      setSuccessMessage('Delivery agent assigned successfully! Status updated to IN_TRANSIT.');
      // Refresh to get updated agent availability
      const updatedAgents = await agentApi.list();
      setAgents(updatedAgents.data?.data || []);
    } catch (err) {
      // Rule BL-06: blocks if agent unavailable (409 Conflict)
      const msg = err.response?.data?.message || 'Failed to assign agent. Agent may be unavailable.';
      setErrorMessage(msg);
    } finally {
      setAssigningAgent(false);
    }
  };

  const handleAssignWarehouse = async () => {
    if (!selectedWarehouseId) return;
    setAssigningWarehouse(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await shipmentApi.assignWarehouse(id, selectedWarehouseId);
      setShipment(res.data?.data || shipment);
      setSuccessMessage('Warehouse hub assigned successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to assign warehouse hub.';
      setErrorMessage(msg);
    } finally {
      setAssigningWarehouse(false);
    }
  };

  if (loading) return <Loader message="Loading shipment consignment..." />;
  if (!shipment) return <ErrorMessage message="Shipment record not found." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Shipment: <span style={{ color: 'var(--accent-cyan)' }}>{shipment.trackingNumber || '#' + shipment.id}</span>
          </h1>
          <p className="page-subtitle">Consignment overview, cargo breakdown, and transit logistics</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/admin/tracking/${shipment.id}`} className="btn btn-primary btn-sm">
            📍 Full Tracking Timeline
          </Link>
          <Link to="/admin/shipments" className="btn btn-secondary btn-sm">
            ← Back to Shipments
          </Link>
        </div>
      </div>

      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && (
        <div className="badge badge-delivered" style={{ display: 'block', padding: '0.8rem', marginBottom: '1.25rem', textAlign: 'center' }}>
          {successMessage}
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Status & Key Info Card */}
        <div className="card">
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
            📊 Consignment Status
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Current Status:</span>
            <StatusBadge status={shipment.status} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Payment Status:</span>
            <StatusBadge status={shipment.payment?.paymentStatus || 'PENDING'} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Payment Amount:</span>
            <strong style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem' }}>
              ₹{shipment.payment?.amount?.toFixed(2) || '0.00'}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
            <span>{shipment.payment?.paymentMethod || 'CASH'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Weight:</span>
            <span>{shipment.weight} kg</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Booking Date:</span>
            <span>{shipment.shipmentDateTime ? new Date(shipment.shipmentDateTime).toLocaleString() : 'N/A'}</span>
          </div>
        </div>

        {/* Route Card */}
        <div className="card">
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
            🚚 Route &amp; Destination
          </h2>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>SOURCE PICKUP:</span>
            <strong>{shipment.source}</strong>
          </p>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>DELIVERY DESTINATION:</span>
            <strong>{shipment.destination}</strong>
          </p>
          <p style={{ fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>EXPECTED DELIVERY:</span>
            <span>{shipment.deliveryDate || 'Standard 3-5 business days'}</span>
          </p>
        </div>

        {/* Customer Info Card */}
        <div className="card">
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
            👤 Customer Information
          </h2>
          {shipment.customer ? (
            <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
              <div><strong>Name:</strong> {shipment.customer.name}</div>
              <div><strong>Email:</strong> {shipment.customer.email}</div>
              <div><strong>Phone:</strong> {shipment.customer.contact}</div>
              <div><strong>Address:</strong> {shipment.customer.address}</div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No customer profile attached.</p>
          )}
        </div>

        {/* Package Specifications Card */}
        <div className="card">
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
            📦 Package Specifications
          </h2>
          {shipment.packageEntity ? (
            <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
              <div><strong>Description:</strong> {shipment.packageEntity.description}</div>
              <div><strong>Type:</strong> {shipment.packageEntity.packageType}</div>
              <div><strong>Weight:</strong> {shipment.packageEntity.weight} kg</div>
              <div>
                <strong>Fragile:</strong>{' '}
                {shipment.packageEntity.fragile ? (
                  <span className="badge badge-cancelled">⚠️ Fragile Item</span>
                ) : (
                  <span className="badge badge-delivered">Standard Cargo</span>
                )}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No package specs available.</p>
          )}
        </div>
      </div>

      {/* Dispatch Controls: Assign Agent and Warehouse */}
      <div className="card" style={{ marginTop: '0.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>
          ⚙️ Dispatch &amp; Hub Assignment
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Assign Delivery Agent */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>🚴 Assign Delivery Agent</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Assign an available delivery agent. Once assigned, their availability will automatically become unavailable.
            </p>

            <div className="form-group">
              <select
                className="form-control"
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
              >
                <option value="">-- Choose Agent --</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.contact}) — {a.availability ? '✅ Available' : '❌ Unavailable'}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAssignAgent}
              disabled={assigningAgent || !selectedAgentId}
              className="btn btn-primary btn-sm"
            >
              {assigningAgent ? 'Assigning...' : 'Assign Agent & Dispatch'}
            </button>
          </div>

          {/* Assign Warehouse */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>🏭 Assign Warehouse Hub</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Route this shipment through a designated sorting or storage center.
            </p>

            <div className="form-group">
              <select
                className="form-control"
                value={selectedWarehouseId}
                onChange={(e) => setSelectedWarehouseId(e.target.value)}
              >
                <option value="">-- Choose Warehouse --</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.location})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAssignWarehouse}
              disabled={assigningWarehouse || !selectedWarehouseId}
              className="btn btn-secondary btn-sm"
            >
              {assigningWarehouse ? 'Updating...' : 'Update Warehouse'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminShipmentDetails;
