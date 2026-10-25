import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

/**
 * DashboardLayout wraps protected portal pages with the persistent Sidebar and Navbar.
 */
export const DashboardLayout = ({ children }) => {
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

export default DashboardLayout;
