import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const Footer = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return '/customer/login';
    const role = (user.role || '').toUpperCase();
    if (role.includes('ADMIN')) return '/admin/dashboard';
    if (role.includes('DELIVERY') || role.includes('AGENT')) return '/agent/dashboard';
    return '/customer/dashboard';
  };

  const handleTrackClick = () => {
    if (user?.role === 'ROLE_ADMIN') {
      navigate('/admin/tracking');
    } else {
      navigate('/customer/track');
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-gradient-line" />
      <div className="footer-container">
        {/* Top 4-Column Section */}
        <div className="footer-grid">
          {/* Column 1: Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-brand-header">
              <div className="footer-brand-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <span className="footer-brand-title">
                <span className="brand-name-white">Courier &amp;&nbsp;</span>
                <span className="brand-name-orange">Logistics</span>
              </span>
            </div>

            <p className="footer-brand-desc">
              Book, track and deliver shipments with confidence. One platform for customers, admins and delivery agents.
            </p>

            <div className="footer-social-links">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                title="Website / Network"
                aria-label="Website"
              >
                🌐
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>in</span>
              </a>
              <a
                href="https://github.com/Dibbyansh100"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                title="Source Code / API"
                aria-label="Code"
              >
                &lt;/&gt;
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-nav-list">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/customer/track">Track Shipment</Link>
              </li>
              <li>
                <Link to={getDashboardLink()}>Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div className="footer-col">
            <h4 className="footer-heading">Our Services</h4>
            <ul className="footer-nav-list">
              <li>
                <Link to={isAuthenticated ? '/customer/book' : '/customer/login'}>Shipment Booking</Link>
              </li>
              <li>
                <Link to="/customer/track">Real-time Tracking</Link>
              </li>
              <li>
                <Link to="/agent/dashboard">Delivery Agent Updates</Link>
              </li>
              <li>
                <Link to="/admin/warehouses">Warehouse Management</Link>
              </li>
              <li>
                <Link to="/customer/payments">Secure Payments</Link>
              </li>
              <li>
                <Link to={isAuthenticated ? '/customer/book' : '/customer/login'}>Fragile Item Handling</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div className="footer-col contact-col">
            <h4 className="footer-heading">Contact &amp; Support</h4>
            <div className="footer-contact-list">
              <div className="contact-item">
                <span className="contact-icon">✉</span>
                <a href="mailto:dibbyansh100mit@gmail.com" className="contact-text">
                  dibbyansh100mit@gmail.com
                </a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <a href="tel:7379691072" className="contact-text">
                  7379691072
                </a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🕒</span>
                <span className="contact-text">24/7 Support</span>
              </div>
            </div>

            <button onClick={handleTrackClick} className="btn-footer-track">
              Track Your Shipment
            </button>
          </div>
        </div>

        {/* Divider */}
        <hr className="footer-divider" />

        {/* Bottom Legal / Copyright Section */}
        <div className="footer-bottom-row">
          <div className="footer-copyright">
            © 2026 Courier &amp; Logistics. All rights reserved.
          </div>
          <div className="footer-legal-links">
            <Link to="/customer/help">Privacy Policy</Link>
            <Link to="/customer/help">Terms of Service</Link>
            <Link to="/customer/help">Cookie Policy</Link>
            <Link to="/customer/help">Help Center</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
