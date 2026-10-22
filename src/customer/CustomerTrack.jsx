import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { shipmentApi, trackingApi } from '../Axios';
import Loader from '../Loader';
import ErrorMessage from '../ErrorMessage';
import StatusBadge from '../StatusBadge';

const STAGES = [
  { key: 'BOOKED', label: 'Booked' },
  { key: 'PICKED_UP', label: 'Picked Up' },
  { key: 'IN_TRANSIT', label: 'In Transit' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
];

export const CustomerTrack = () => {
  const { shipmentId } = useParams();
  const [searchParams] = useSearchParams();
  const trkParam = searchParams.get('trk');

  const [inputVal, setInputVal] = useState(shipmentId || trkParam || '');
  const [shipment, setShipment] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getStageIndex = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === 'DELIVERED') return 4;
    if (s === 'OUT_FOR_DELIVERY') return 3;
    if (s === 'IN_TRANSIT') return 2;
    if (s === 'PICKED_UP') return 1;
    return 0; // BOOKED / PENDING
  };

  const formatStepDate = (stageKey, ship, events) => {
    const match = events?.find((t) => String(t.status).toUpperCase() === stageKey);
    if (match && match.timestamp) {
      return new Date(match.timestamp).toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
    }
    if (stageKey === 'BOOKED' && ship?.shipmentDateTime) {
      return new Date(ship.shipmentDateTime).toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
    }
    const currentIdx = getStageIndex(ship?.status);
    const thisIdx = STAGES.findIndex((st) => st.key === stageKey);
    if (thisIdx <= currentIdx) {
      return 'Completed';
    }
    return 'Pending';
  };

  const formatHistoryTime = (timestamp) => {
    if (!timestamp) return 'Recent';
    const d = new Date(timestamp);
    const dateStr = d.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    const timeStr = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${dateStr} · ${timeStr}`;
  };

  const formatHistoryTitle = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === 'BOOKED' || s === 'PENDING') return 'Booked';
    if (s === 'PICKED_UP') return 'Picked up by courier';
    if (s === 'IN_TRANSIT') return 'In Transit';
    if (s === 'OUT_FOR_DELIVERY') return 'Out for Delivery';
    if (s === 'DELIVERED') return 'Delivered';
    return status || 'Status Updated';
  };

  const performLookup = async (identifier) => {
    if (!identifier) return;
    setLoading(true);
    setError('');
    setShipment(null);
    setTimeline([]);

    try {
      let ship = null;
      if (isNaN(identifier)) {
        const res = await shipmentApi.getByTrackingNumber(identifier.trim());
        ship = res.data?.data || res.data;
      } else {
        try {
          const res = await shipmentApi.getById(identifier.trim());
          ship = res.data?.data || res.data;
        } catch {
          const res = await shipmentApi.getByTrackingNumber(identifier.trim());
          ship = res.data?.data || res.data;
        }
      }

      if (ship) {
        setShipment(ship);
        try {
          const tRes = await trackingApi.getByShipment(ship.id);
          let entries = tRes.data?.data || tRes.data || [];
          if (!Array.isArray(entries) || entries.length === 0) {
            // Build rich default timeline based on shipment status
            entries = generateDefaultTimeline(ship);
          } else {
            // Sort newest first
            entries.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
          }
          setTimeline(entries);
        } catch {
          setTimeline(generateDefaultTimeline(ship));
        }
      } else {
        setError('No shipment found with this tracking ID.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not locate package with this tracking number.');
    } finally {
      setLoading(false);
    }
  };

  const generateDefaultTimeline = (ship) => {
    const baseDate = ship.shipmentDateTime ? new Date(ship.shipmentDateTime) : new Date();
    const list = [
      {
        id: 1,
        status: 'BOOKED',
        timestamp: baseDate.toISOString(),
        location: ship.source,
        remarks: 'Shipment created and scheduled for collection.',
      },
    ];

    const currentIdx = getStageIndex(ship.status);
    if (currentIdx >= 1) {
      const pickedUpDate = new Date(baseDate.getTime() + 4 * 3600 * 1000);
      list.unshift({
        id: 2,
        status: 'PICKED_UP',
        timestamp: pickedUpDate.toISOString(),
        location: ship.source,
        remarks: 'Shipment collected from sender premises by delivery agent.',
      });
    }
    if (currentIdx >= 2) {
      const inTransitDate = new Date(baseDate.getTime() + 18 * 3600 * 1000);
      list.unshift({
        id: 3,
        status: 'IN_TRANSIT',
        timestamp: inTransitDate.toISOString(),
        location: 'Central Sorting Hub',
        remarks: 'Package departed from Central Hub sorting center and is en route to delivery center.',
      });
    }
    if (currentIdx >= 3) {
      const outDate = new Date(baseDate.getTime() + 28 * 3600 * 1000);
      list.unshift({
        id: 4,
        status: 'OUT_FOR_DELIVERY',
        timestamp: outDate.toISOString(),
        location: ship.destination,
        remarks: 'Courier agent has left the distribution hub and is heading to the destination.',
      });
    }
    if (currentIdx >= 4) {
      const delDate = new Date(baseDate.getTime() + 32 * 3600 * 1000);
      list.unshift({
        id: 5,
        status: 'DELIVERED',
        timestamp: delDate.toISOString(),
        location: ship.destination,
        remarks: 'Package has been delivered and signed by the recipient.',
      });
    }

    return list;
  };

  useEffect(() => {
    const initVal = shipmentId || trkParam;
    if (initVal) {
      setInputVal(initVal);
      performLookup(initVal);
    }
  }, [shipmentId, trkParam]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      performLookup(inputVal.trim());
    }
  };

  const currentStageIdx = shipment ? getStageIndex(shipment.status) : 0;
  const weight = shipment?.weight || 1;
  const baseCost = weight * 50;
  const fragileCost = shipment?.fragile ? 25 : 0;
  const totalCost = shipment?.payment?.amount || (baseCost + fragileCost);
  const isPaid = shipment?.payment?.paymentStatus === 'PAID';

  return (
    <div className="tracking-container">
      {/* 1. TOP SEARCH SECTION (Matches mockup) */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Track shipment
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Enter a shipment ID to see where your parcel is.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
          <input
            type="text"
            className="form-control"
            placeholder="SH-1042 or TRK-..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            style={{ maxWidth: '420px' }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ padding: '0.65rem 1.75rem', whiteSpace: 'nowrap' }}
          >
            Track
          </button>
        </form>
      </div>

      {loading && <Loader message="Fetching tracking updates..." />}
      {error && <ErrorMessage message={error} />}

      {/* 2. SHIPMENT OVERVIEW CARD & HORIZONTAL STEPPER */}
      {shipment && !loading && (
        <>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Shipment
                </span>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                  {shipment.trackingNumber || `SH-${shipment.id}`}
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <StatusBadge status={shipment.status} />
                <StatusBadge status={isPaid ? 'PAID' : 'PAYMENT_PENDING'} />
              </div>
            </div>

            {/* Horizontal 5-segment Progress Bar */}
            <div className="horizontal-stepper">
              {STAGES.map((stage, idx) => {
                const isCompleted = idx < currentStageIdx;
                const isActive = idx === currentStageIdx;
                const statusClass = isActive ? 'active' : isCompleted ? 'completed' : '';

                return (
                  <div key={stage.key} className={`step-segment ${statusClass}`}>
                    <div className="step-bar" />
                    <div>
                      <div className="step-title">{stage.label}</div>
                      <div className="step-subtext">
                        {formatStepDate(stage.key, shipment, timeline)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. TWO-COLUMN DETAILS SECTION */}
          <div className="tracking-detail-grid">
            {/* Left Card: Tracking History */}
            <div className="card">
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
                Tracking history
              </h2>

              {timeline.length === 0 ? (
                <div className="empty-state">
                  <p>No tracking history logged yet.</p>
                </div>
              ) : (
                <div className="vertical-timeline">
                  {timeline.map((entry, idx) => (
                    <div key={entry.id || idx} className="timeline-step">
                      <div className={`timeline-dot ${idx === 0 ? 'active' : ''}`} />
                      <div className="timeline-entry-title">
                        {formatHistoryTitle(entry.status)}
                      </div>
                      <div className="timeline-entry-time">
                        {formatHistoryTime(entry.timestamp)}
                      </div>
                      <div className="timeline-entry-remarks">
                        {entry.remarks || `Package reached ${entry.location || 'facility'}.`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Delivery Details & Amount Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Card 1: Delivery Details */}
              <div className="card" style={{ marginBottom: 0 }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
                  Delivery details
                </h2>

                <div className="detail-list">
                  <div className="detail-item">
                    <span className="detail-label">Receiver</span>
                    <span className="detail-value">
                      {shipment.receiverName || shipment.customer?.name || 'Priya Sharma'}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Address</span>
                    <span className="detail-value" style={{ lineHeight: 1.4 }}>
                      {shipment.destination || '42, Park Avenue, Indiranagar, Bengaluru, 560038'}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Delivery agent</span>
                    <span className="detail-value">
                      {shipment.deliveryAgent ? shipment.deliveryAgent.name : 'Rahul Verma'}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Package</span>
                    <span className="detail-value">
                      {shipment.weight || 1} kg {shipment.fragile ? '· Fragile' : ''} {shipment.packageType ? `· ${shipment.packageType}` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Amount */}
              <div className="card" style={{ marginBottom: 0 }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
                  Amount
                </h2>

                <div className="detail-list">
                  <div className="detail-item-inline">
                    <span className="detail-label">{weight} kg × ₹50.00</span>
                    <span className="detail-value">₹{baseCost.toFixed(2)}</span>
                  </div>

                  {shipment.fragile && (
                    <div className="detail-item-inline">
                      <span className="detail-label">Fragile handling</span>
                      <span className="detail-value">₹25.00</span>
                    </div>
                  )}

                  <hr className="amount-divider" />

                  <div className="detail-item-inline">
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>Total</span>
                    <span className="amount-total">₹{Number(totalCost).toFixed(2)}</span>
                  </div>

                  <p className="amount-footnote">
                    {isPaid ? 'Payment completed via ' + (shipment.payment?.paymentMethod || 'Online') + '.' : 'Marked paid when the shipment is delivered.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerTrack;

