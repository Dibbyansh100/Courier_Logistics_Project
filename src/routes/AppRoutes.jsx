import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { DashboardLayout } from '../components/layout';
import { ROLES } from '../constants';

// Public Pages
import Homepage from '../Homepage';
import Login from '../Login';
import Register from '../Register';

// Admin Portal Pages
import {
  AdminLogin,
  AdminRegister,
  AdminDashboard,
  AdminCustomers,
  AdminCustomerForm,
  AdminAgents,
  AdminAgentForm,
  AdminWarehouses,
  AdminWarehouseForm,
  AdminShipments,
  AdminBookShipment,
  AdminShipmentDetails,
  AdminPackages,
  AdminPayments,
  AdminProfile,
  AdminTracking,
} from '../admin';

// Customer Portal Pages
import {
  CustomerLogin,
  CustomerRegister,
  CustomerDashboard,
  CustomerBook,
  CustomerShipments,
  CustomerShipmentDetails,
  CustomerPayments,
  CustomerProfile,
  CustomerHelp,
  CustomerTrack,
} from '../customer';

// Delivery Agent Portal Pages
import {
  AgentLogin,
  AgentRegister,
  AgentDashboard,
  AgentShipments,
  AgentShipmentDetails,
  AgentHistory,
  AgentProfile,
  AgentStatus,
} from '../agent';

/**
 * Higher-Order Route Helper for Protected Dashboard Pages
 */
const renderProtectedDashboard = (Component, role) => (
  <ProtectedRoute allowedRole={role}>
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  </ProtectedRoute>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ===== PUBLIC & DIRECT AUTHENTICATION ROUTES ===== */}
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Portal Auth Pages */}
      <Route path="/customer/login" element={<CustomerLogin />} />
      <Route path="/customer/register" element={<CustomerRegister />} />
      <Route path="/agent/login" element={<AgentLogin />} />
      <Route path="/agent/register" element={<AgentRegister />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />

      {/* ===== ADMIN PORTAL (ROLE_ADMIN) ===== */}
      <Route path="/admin/dashboard" element={renderProtectedDashboard(AdminDashboard, ROLES.ADMIN)} />
      <Route path="/admin/customers" element={renderProtectedDashboard(AdminCustomers, ROLES.ADMIN)} />
      <Route path="/admin/customers/new" element={renderProtectedDashboard(AdminCustomerForm, ROLES.ADMIN)} />
      <Route path="/admin/customers/:id/edit" element={renderProtectedDashboard(AdminCustomerForm, ROLES.ADMIN)} />
      <Route path="/admin/agents" element={renderProtectedDashboard(AdminAgents, ROLES.ADMIN)} />
      <Route path="/admin/agents/new" element={renderProtectedDashboard(AdminAgentForm, ROLES.ADMIN)} />
      <Route path="/admin/agents/:id/edit" element={renderProtectedDashboard(AdminAgentForm, ROLES.ADMIN)} />
      <Route path="/admin/warehouses" element={renderProtectedDashboard(AdminWarehouses, ROLES.ADMIN)} />
      <Route path="/admin/warehouses/new" element={renderProtectedDashboard(AdminWarehouseForm, ROLES.ADMIN)} />
      <Route path="/admin/warehouses/:id/edit" element={renderProtectedDashboard(AdminWarehouseForm, ROLES.ADMIN)} />
      <Route path="/admin/shipments" element={renderProtectedDashboard(AdminShipments, ROLES.ADMIN)} />
      <Route path="/admin/shipments/new" element={renderProtectedDashboard(AdminBookShipment, ROLES.ADMIN)} />
      <Route path="/admin/shipments/:id" element={renderProtectedDashboard(AdminShipmentDetails, ROLES.ADMIN)} />
      <Route path="/admin/packages" element={renderProtectedDashboard(AdminPackages, ROLES.ADMIN)} />
      <Route path="/admin/payments" element={renderProtectedDashboard(AdminPayments, ROLES.ADMIN)} />
      <Route path="/admin/profile" element={renderProtectedDashboard(AdminProfile, ROLES.ADMIN)} />
      <Route path="/admin/tracking" element={renderProtectedDashboard(AdminTracking, ROLES.ADMIN)} />
      <Route path="/admin/tracking/:shipmentId" element={renderProtectedDashboard(AdminTracking, ROLES.ADMIN)} />

      {/* ===== CUSTOMER PORTAL (ROLE_CUSTOMER) ===== */}
      <Route path="/customer/dashboard" element={renderProtectedDashboard(CustomerDashboard, ROLES.CUSTOMER)} />
      <Route path="/customer/book" element={renderProtectedDashboard(CustomerBook, ROLES.CUSTOMER)} />
      <Route path="/customer/shipments" element={renderProtectedDashboard(CustomerShipments, ROLES.CUSTOMER)} />
      <Route path="/customer/shipments/:id" element={renderProtectedDashboard(CustomerShipmentDetails, ROLES.CUSTOMER)} />
      <Route path="/customer/payments" element={renderProtectedDashboard(CustomerPayments, ROLES.CUSTOMER)} />
      <Route path="/customer/profile" element={renderProtectedDashboard(CustomerProfile, ROLES.CUSTOMER)} />
      <Route path="/customer/help" element={renderProtectedDashboard(CustomerHelp, ROLES.CUSTOMER)} />
      <Route path="/customer/track" element={renderProtectedDashboard(CustomerTrack, ROLES.CUSTOMER)} />
      <Route path="/customer/track/:shipmentId" element={renderProtectedDashboard(CustomerTrack, ROLES.CUSTOMER)} />

      {/* ===== DELIVERY AGENT PORTAL (ROLE_DELIVERY) ===== */}
      <Route path="/agent/dashboard" element={renderProtectedDashboard(AgentDashboard, ROLES.AGENT)} />
      <Route path="/agent/shipments" element={renderProtectedDashboard(AgentShipments, ROLES.AGENT)} />
      <Route path="/agent/shipments/:id" element={renderProtectedDashboard(AgentShipmentDetails, ROLES.AGENT)} />
      <Route path="/agent/history" element={renderProtectedDashboard(AgentHistory, ROLES.AGENT)} />
      <Route path="/agent/profile" element={renderProtectedDashboard(AgentProfile, ROLES.AGENT)} />
      <Route path="/agent/status/:shipmentId" element={renderProtectedDashboard(AgentStatus, ROLES.AGENT)} />

      {/* ===== WILDCARD CATCH-ALL ===== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
