import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = ({ allowedRole, children }) => {
  const { user } = useAuth();

  // Fallback to sessionStorage to guard against state sync delay during navigation
  let activeUser = user;
  if (!activeUser) {
    try {
      const stored = sessionStorage.getItem('authUser');
      if (stored) {
        activeUser = JSON.parse(stored);
      }
    } catch (e) {
      activeUser = null;
    }
  }

  if (!activeUser) {
    return <Navigate to="/login" replace />;
  }

  const rawRole = (activeUser.role || '').toUpperCase().trim();
  const rawAllowed = (allowedRole || '').toUpperCase().trim();

  // Match e.g. ROLE_CUSTOMER with ROLE_CUSTOMER or CUSTOMER
  const isMatch =
    !allowedRole ||
    rawRole === rawAllowed ||
    rawRole.replace(/^ROLE_/, '') === rawAllowed.replace(/^ROLE_/, '');

  if (!isMatch) {
    if (rawRole.includes('ADMIN')) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (rawRole.includes('DELIVERY') || rawRole.includes('AGENT')) {
      return <Navigate to="/agent/dashboard" replace />;
    } else if (rawRole.includes('CUSTOMER') || rawRole.includes('USER')) {
      return <Navigate to="/customer/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
