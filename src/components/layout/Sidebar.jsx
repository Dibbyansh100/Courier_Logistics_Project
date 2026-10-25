import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  // State to track if sidebar is minimized (collapsed to icon-only)
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return true;
    }
    return localStorage.getItem('sidebar_minimized') === 'true';
  });

  // State to track which multilevel submenu accordions are open
  const [openMenus, setOpenMenus] = useState({
    admin: location.pathname.startsWith('/admin') || (user && user.role === 'ROLE_ADMIN'),
    customer: location.pathname.startsWith('/customer') || (user && user.role === 'ROLE_CUSTOMER'),
    agent: location.pathname.startsWith('/agent') || (user && user.role === 'ROLE_DELIVERY'),
  });

  // Listen to custom toggle-sidebar event triggered by Navbar hamburger button on mobile
  useEffect(() => {
    const handleToggle = () => {
      setIsMinimized((prev) => !prev);
    };
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  const sidebarRef = useRef(null);

  // Close sidebar on mobile navigation
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setIsMinimized(true);
    }
  }, [location.pathname]);

  // Close sidebar when tapping outside on mobile (without any blur overlay)
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        typeof window !== 'undefined' &&
        window.innerWidth <= 768 &&
        !isMinimized &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('.navbar-mobile-toggle')
      ) {
        setIsMinimized(true);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isMinimized]);

  // Keep active route's accordion expanded on route changes
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      setOpenMenus((prev) => ({ ...prev, admin: true }));
    } else if (location.pathname.startsWith('/customer')) {
      setOpenMenus((prev) => ({ ...prev, customer: true }));
    } else if (location.pathname.startsWith('/agent')) {
      setOpenMenus((prev) => ({ ...prev, agent: true }));
    }
  }, [location.pathname]);

  const toggleMinimize = () => {
    setIsMinimized((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_minimized', String(next));
      return next;
    });
  };

  const toggleSubmenu = (menuKey) => {
    if (isMinimized) {
      // If user clicks a category while minimized, automatically expand the sidebar
      setIsMinimized(false);
      localStorage.setItem('sidebar_minimized', 'false');
      setOpenMenus((prev) => ({ ...prev, [menuKey]: true }));
      return;
    }
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  return (
    <aside ref={sidebarRef} className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
      {/* Sidebar Header with 3-line Hamburger button */}
      <div className="sidebar-header">
        {!isMinimized && (
          <div className="sidebar-header-title">
            <span style={{ fontSize: '1.25rem' }}>📦</span>
            <span style={{ fontWeight: 700 }}>LogiTrack Hub</span>
          </div>
        )}
        <button
          type="button"
          onClick={toggleMinimize}
          className="sidebar-toggle-btn"
          title={isMinimized ? 'Expand sidebar (3 lines)' : 'Minimize sidebar (3 lines)'}
          aria-label="Toggle Sidebar"
        >
          ☰
        </button>
      </div>

      <nav className="sidebar-nav">
        {/* Top Direct Link: Home */}
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          title="Home Page"
        >
          <span>Home Page</span>
        </NavLink>

        {/* 1. ADMIN ACCORDION MENU */}
        <div className="sidebar-menu-group">
          <button
            type="button"
            className={`sidebar-accordion-header ${
              location.pathname.startsWith('/admin') ? 'active-parent' : ''
            }`}
            onClick={() => toggleSubmenu('admin')}
            title="Admin Portal"
          >
            <div className="sidebar-accordion-left">
              <span className="sidebar-accordion-title">Admin</span>
            </div>
            <span
              className={`sidebar-accordion-chevron ${openMenus.admin ? 'open' : ''}`}
            >
              ▼
            </span>
          </button>

          {openMenus.admin && (
            <div className="sidebar-submenu">
              <NavLink
                to="/admin/login"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Sign In
              </NavLink>
              <NavLink
                to="/admin/register"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Register
              </NavLink>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/customers"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Customers
              </NavLink>
              <NavLink
                to="/admin/agents"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Agents
              </NavLink>
              <NavLink
                to="/admin/warehouses"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Warehouses
              </NavLink>
              <NavLink
                to="/admin/shipments"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Shipments
              </NavLink>
              <NavLink
                to="/admin/shipments/new"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Book Shipment
              </NavLink>
              <NavLink
                to="/admin/packages"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Packages
              </NavLink>
              <NavLink
                to="/admin/payments"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Payments
              </NavLink>
              <NavLink
                to="/admin/tracking"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Tracking
              </NavLink>
              <NavLink
                to="/admin/profile"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Profile
              </NavLink>
            </div>
          )}
        </div>

        {/* 2. CUSTOMER ACCORDION MENU */}
        <div className="sidebar-menu-group">
          <button
            type="button"
            className={`sidebar-accordion-header ${
              location.pathname.startsWith('/customer') ? 'active-parent' : ''
            }`}
            onClick={() => toggleSubmenu('customer')}
            title="Customer Portal"
          >
            <div className="sidebar-accordion-left">
              <span className="sidebar-accordion-title">Customer</span>
            </div>
            <span
              className={`sidebar-accordion-chevron ${openMenus.customer ? 'open' : ''}`}
            >
              ▼
            </span>
          </button>

          {openMenus.customer && (
            <div className="sidebar-submenu">
              <NavLink
                to="/customer/login"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Sign In
              </NavLink>
              <NavLink
                to="/customer/register"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Register
              </NavLink>
              <NavLink
                to="/customer/dashboard"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/customer/book"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Book Shipment
              </NavLink>
              <NavLink
                to="/customer/shipments"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                My Shipments
              </NavLink>
              <NavLink
                to="/customer/payments"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Invoices &amp; Payments
              </NavLink>
              <NavLink
                to="/customer/track"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Live Tracking
              </NavLink>
              <NavLink
                to="/customer/profile"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Profile
              </NavLink>
              <NavLink
                to="/customer/help"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Help &amp; FAQ
              </NavLink>
            </div>
          )}
        </div>

        {/* 3. DELIVERY AGENT ACCORDION MENU */}
        <div className="sidebar-menu-group">
          <button
            type="button"
            className={`sidebar-accordion-header ${
              location.pathname.startsWith('/agent') ? 'active-parent' : ''
            }`}
            onClick={() => toggleSubmenu('agent')}
            title="Delivery Agent Portal"
          >
            <div className="sidebar-accordion-left">
              <span className="sidebar-accordion-title">Agent</span>
            </div>
            <span
              className={`sidebar-accordion-chevron ${openMenus.agent ? 'open' : ''}`}
            >
              ▼
            </span>
          </button>

          {openMenus.agent && (
            <div className="sidebar-submenu">
              <NavLink
                to="/agent/login"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Sign In
              </NavLink>
              <NavLink
                to="/agent/register"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Register
              </NavLink>
              <NavLink
                to="/agent/dashboard"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/agent/shipments"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Active Tasks
              </NavLink>
              <NavLink
                to="/agent/history"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Delivery History
              </NavLink>
              <NavLink
                to="/agent/profile"
                className={({ isActive }) => `sidebar-sub-link ${isActive ? 'active' : ''}`}
              >
                Agent Profile
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
