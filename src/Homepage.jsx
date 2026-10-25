import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Sidebar, Navbar, Footer } from './components/layout';
import heroBg from './assets/hero-bg.jpg';
import { ROLES } from './constants';

export const Homepage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [quickTrack, setQuickTrack] = useState('');

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!quickTrack.trim()) return;
    if (isAuthenticated && user?.role === ROLES.ADMIN) {
      navigate(`/admin/tracking?trk=${encodeURIComponent(quickTrack.trim())}`);
    } else {
      navigate(`/customer/track?trk=${encodeURIComponent(quickTrack.trim())}`);
    }
  };

  return (
    <div className="homepage-wrapper">
      {/* Multilevel Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="homepage-main-container">
        <Navbar />

        {/* 1. Hero Section with Background Photo & Dark Navy Gradient Overlay */}
        <section
          className="hero-section-landing"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(11,37,69,0.92) 0%, rgba(11,37,69,0.65) 50%, rgba(11,37,69,0.25) 100%), url(${heroBg})`,
          }}
          aria-label="Hero Introduction"
        >
          <div className="hero-inner-container">
            <div className="hero-text-block">
              <span className="hero-category-label">COURIER &amp; LOGISTICS</span>
              <h1 className="hero-main-heading">
                Reliable, Fast and Secure Shipment Tracking
              </h1>
              <p className="hero-subtext">
                Book shipments, follow every update in real time and get your parcel delivered safely.
              </p>
              <div className="hero-cta-group">
                <Link
                  to="/customer/track"
                  className="hero-cta-btn-primary"
                  aria-label="Track your shipment"
                >
                  Track Your Shipment
                </Link>
                <Link
                  to="/register"
                  className="hero-cta-btn-secondary"
                  aria-label="Book a shipment"
                >
                  Book a Shipment
                </Link>
              </div>
            </div>
          </div>

          {/* 4px Orange-to-Amber Gradient Bottom Line */}
          <div className="hero-bottom-gradient-line" aria-hidden="true" />
        </section>

        {/* 2. Stats Strip Overlapping the Hero Bottom Edge */}
        <section className="stats-strip-wrapper" aria-label="Key Performance Indicators">
          <div className="stats-card">
            <ul className="stats-strip-grid">
              <li className="stat-strip-item">
                <div className="stat-strip-num">60</div>
                <div className="stat-strip-bar" aria-hidden="true" />
                <div className="stat-strip-text">Shipments Delivered</div>
              </li>
              <li className="stat-strip-item">
                <div className="stat-strip-num">15+</div>
                <div className="stat-strip-bar" aria-hidden="true" />
                <div className="stat-strip-text">Delivery Agents</div>
              </li>
              <li className="stat-strip-item">
                <div className="stat-strip-num">20+</div>
                <div className="stat-strip-bar" aria-hidden="true" />
                <div className="stat-strip-text">Cities Covered</div>
              </li>
              <li className="stat-strip-item">
                <div className="stat-strip-num">24/7</div>
                <div className="stat-strip-bar" aria-hidden="true" />
                <div className="stat-strip-text">Support Available</div>
              </li>
            </ul>
          </div>
        </section>

        {/* 3. Quick Tracking Search & Core Feature Highlights */}
        <div className="homepage-content-body">
          <div className="card homepage-search-box">
            <h2 className="homepage-section-title">Instant Parcel Lookup</h2>
            <p className="homepage-section-subtitle">
              Have a consignment number? Enter it below to check current transit status.
            </p>
            <form onSubmit={handleTrackSubmit} className="homepage-search-form">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Tracking Number (e.g., TRK-001042)..."
                value={quickTrack}
                onChange={(e) => setQuickTrack(e.target.value)}
                aria-label="Consignment Tracking Number"
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0 1.75rem', whiteSpace: 'nowrap' }}
              >
                Track
              </button>
            </form>
          </div>

          {/* Core Feature Highlights */}
          <div className="hero-features">
            <div className="feature-box">
              <div className="feature-svg-icon" aria-hidden="true">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <h3 className="feature-title">Live Checkpoint Monitoring</h3>
              <p className="feature-desc">
                Instant consignment tracking with comprehensive timeline checkpoints recorded at each transit hub.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-svg-icon" aria-hidden="true">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 21h18" />
                  <path d="M5 21V7l8-4v18" />
                  <path d="M19 21V11l-6-4" />
                  <path d="M9 9v.01" />
                  <path d="M9 12v.01" />
                  <path d="M9 15v.01" />
                  <path d="M9 18v.01" />
                </svg>
              </div>
              <h3 className="feature-title">Warehouse Distribution</h3>
              <p className="feature-desc">
                Seamless hub transfers, capacity tracking, and localized sorting operations across regional networks.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-svg-icon" aria-hidden="true">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <h3 className="feature-title">Integrated Invoicing</h3>
              <p className="feature-desc">
                Automatic freight billing calculation with invoice generation and automated payment clearance on delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Minimized Navy & Orange Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Homepage;
