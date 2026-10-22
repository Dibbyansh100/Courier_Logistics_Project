import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// Public Pages
import Homepage from './Homepage';
import Login from './Login';
import Register from './Register';

// Admin Portal Pages & Components
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
} from './admin';

// Customer Portal Pages & Components
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
} from './customer';

// Delivery Agent Portal Pages & Components
import {
  AgentLogin,
  AgentRegister,
  AgentDashboard,
  AgentShipments,
  AgentShipmentDetails,
  AgentHistory,
  AgentProfile,
  AgentStatus,
} from './agent';

// Layout Component for Protected Dashboard Views
const DashboardLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar />
        <main className="content-container">{children}</main>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public & Portal Authentication Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer Portal Auth */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/register" element={<CustomerRegister />} />

          {/* Delivery Agent Portal Auth */}
          <Route path="/agent/login" element={<AgentLogin />} />
          <Route path="/agent/register" element={<AgentRegister />} />

          {/* Admin Operations Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* Admin Routes (role: ROLE_ADMIN) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="ROLE_ADMIN">
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute allowedRole="ROLE_ADMIN">
                <DashboardLayout>
                  <AdminCustomers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers/new"
            element={
              <ProtectedRoute allowedRole="ROLE_ADMIN">
                <DashboardLayout>
                  <AdminCustomerForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers/:id/edit"
            element={
              <ProtectedRoute allowedRole="ROLE_ADMIN">
                <DashboardLayout>
                  <AdminCustomerForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/agents"
            element={
              <ProtectedRoute allowedRole="ROLE_ADMIN">
                <DashboardLayout>
                  <AdminAgents />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/agents/new"
            element={
              <ProtectedRoute allowedRole="ROLE_ADMIN">
                <DashboardLayout>
                  <AdminAgentForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/agents/:id/edit"
            element={
              <ProtectedRoute allowedRole="ROLE_ADMIN">
                <DashboardLayout>
                  <AdminAgentForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/warehouses"
            element={
              <ProtectedRoute allowedRole="ROLE_ADMIN">
                <DashboardLayout>
                  <AdminWarehouses />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/warehouses/new"
            element={
              <ProtectedRoute allowedRole="ROLE_ADMIN">
                <DashboardLayout>
                  <AdminWarehouseForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/warehouses/:id/edit"
            element={
              <ProtectedRoute allowedRole="ROLE_ADMIN">
                <DashboardLayout>
                  <AdminWarehouseForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/shipments"
            element={
              <ProtectedRoute allowedRole="ROLE_ADMIN">
                <DashboardLayout>
                  <AdminShipments />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/shipments/new"
            element={
              <ProtectedRoute allowedRole="ROLE_ADMIN">
                <DashboardLayout>
                  <AdminBookShipment />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/shipments/:id"
            element={
              <ProtectedRoute allowedRole="ROLE_ADMIN">
                <DashboardLayout>
                  <AdminShipmentDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/packages"
            element={
              <ProtectedRoute allowedRole="ROLE_ADMIN">
                <DashboardLayout>
                  <AdminPackages />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRole="ROLE_ADMIN">
                <DashboardLayout>
                  <AdminPayments />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute allowedRole="ROLE_ADMIN">
                <DashboardLayout>
                  <AdminProfile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tracking"
            element={
              <ProtectedRoute allowedRole="ROLE_ADMIN">
                <DashboardLayout>
                  <AdminTracking />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tracking/:shipmentId"
            element={
              <ProtectedRoute allowedRole="ROLE_ADMIN">
                <DashboardLayout>
                  <AdminTracking />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Customer Routes (role: ROLE_CUSTOMER) */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRole="ROLE_CUSTOMER">
                <DashboardLayout>
                  <CustomerDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/book"
            element={
              <ProtectedRoute allowedRole="ROLE_CUSTOMER">
                <DashboardLayout>
                  <CustomerBook />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/shipments"
            element={
              <ProtectedRoute allowedRole="ROLE_CUSTOMER">
                <DashboardLayout>
                  <CustomerShipments />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/shipments/:id"
            element={
              <ProtectedRoute allowedRole="ROLE_CUSTOMER">
                <DashboardLayout>
                  <CustomerShipmentDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/payments"
            element={
              <ProtectedRoute allowedRole="ROLE_CUSTOMER">
                <DashboardLayout>
                  <CustomerPayments />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <ProtectedRoute allowedRole="ROLE_CUSTOMER">
                <DashboardLayout>
                  <CustomerProfile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/help"
            element={
              <ProtectedRoute allowedRole="ROLE_CUSTOMER">
                <DashboardLayout>
                  <CustomerHelp />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/track"
            element={
              <ProtectedRoute allowedRole="ROLE_CUSTOMER">
                <DashboardLayout>
                  <CustomerTrack />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/track/:shipmentId"
            element={
              <ProtectedRoute allowedRole="ROLE_CUSTOMER">
                <DashboardLayout>
                  <CustomerTrack />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Delivery Agent Routes (role: ROLE_DELIVERY) */}
          <Route
            path="/agent/dashboard"
            element={
              <ProtectedRoute allowedRole="ROLE_DELIVERY">
                <DashboardLayout>
                  <AgentDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/shipments"
            element={
              <ProtectedRoute allowedRole="ROLE_DELIVERY">
                <DashboardLayout>
                  <AgentShipments />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/shipments/:id"
            element={
              <ProtectedRoute allowedRole="ROLE_DELIVERY">
                <DashboardLayout>
                  <AgentShipmentDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/history"
            element={
              <ProtectedRoute allowedRole="ROLE_DELIVERY">
                <DashboardLayout>
                  <AgentHistory />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/profile"
            element={
              <ProtectedRoute allowedRole="ROLE_DELIVERY">
                <DashboardLayout>
                  <AgentProfile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/status/:shipmentId"
            element={
              <ProtectedRoute allowedRole="ROLE_DELIVERY">
                <DashboardLayout>
                  <AgentStatus />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
