import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleToggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-sidebar'));
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          onClick={handleToggleSidebar}
          className="navbar-mobile-toggle"
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          ☰
        </button>
        <Link to="/" className="navbar-brand">
          <span className="brand-name-white">Courier &amp;&nbsp;</span>
          <span className="brand-name-orange">Logistics</span>
        </Link>
      </div>

      <div className="navbar-user">
        {user ? (
          <>
            <span className="user-name-text">{user.name || user.username}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="navbar-logout-btn"
              title="Log out"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="navbar-logout-btn">
            Sign In
          </Link>
        )}
      </div>
      <div className="navbar-gradient-line" />
    </header>
  );
};

export default Navbar;
