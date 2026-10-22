import React, { useState } from 'react';

export const CustomerHelp = () => {
  const [inquiry, setInquiry] = useState({ subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inquiry.subject.trim() || !inquiry.message.trim()) return;
    setSubmitted(true);
    setInquiry({ subject: '', message: '' });
  };

  const faqs = [
    {
      q: 'How is the shipping charge calculated?',
      a: 'Freight rate is charged at ₹50 per kg. A flat surcharge of ₹100 is added for fragile items to cover specialized bubble packaging and careful transit handling.',
    },
    {
      q: 'When does my payment status get updated to Paid?',
      a: 'For Cash on Delivery shipments, once our delivery agent marks the shipment as "Delivered", the system automatically transitions your invoice payment to "Paid".',
    },
    {
      q: 'How do I track my shipment?',
      a: 'You can use the Track Shipment menu and enter your 12-character tracking number (e.g., TRK-XXXXXXXX) to view real-time transit checkpoints.',
    },
    {
      q: 'Can I cancel or redirect an order?',
      a: 'Shipments in PENDING status can be adjusted by contacting our customer support hub. Shipments in transit cannot be rerouted until arrival at the next destination hub.',
    },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Help &amp; Customer Support</h1>
          <p className="page-subtitle">Find answers to shipping queries or get in touch with our helpdesk</p>
        </div>
      </div>

      {/* Support Hotlines */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">24/7 Helpline</span>
          <span className="stat-value" style={{ fontSize: '1.4rem', color: 'var(--accent-cyan)' }}>
            1800-200-9876
          </span>
          <span className="stat-desc">Toll-free customer assistance</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Email Support</span>
          <span className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>
            support@logitrack.com
          </span>
          <span className="stat-desc">Guaranteed response within 4 hours</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Central Dispatch</span>
          <span className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--accent-emerald)' }}>
            Hub Operations
          </span>
          <span className="stat-desc">Mon - Sat: 8:00 AM - 10:00 PM</span>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="card">
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
              }}
            >
              <h4 style={{ color: 'var(--accent-cyan)', fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                ❓ {faq.q}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Send Inquiry Form */}
      <div className="card">
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Send Us a Message</h2>

        {submitted && (
          <div className="badge badge-delivered" style={{ display: 'block', padding: '0.8rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            ✓ Thank you! Your ticket has been raised. A support representative will follow up shortly.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Question regarding Tracking TRK-AB12CD34"
              value={inquiry.subject}
              onChange={(e) => setInquiry((prev) => ({ ...prev, subject: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Describe your inquiry or parcel concern..."
              value={inquiry.message}
              onChange={(e) => setInquiry((prev) => ({ ...prev, message: e.target.value }))}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerHelp;
