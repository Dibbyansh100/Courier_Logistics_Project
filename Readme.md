# 📦 Courier & Logistics Tracking Platform (Frontend)

Enterprise-grade Courier & Logistics web application built with **React 18**, **React Router v6**, and **Vite**. Provides specialized portals for **Customers**, **Delivery Agents**, and **Operations Administrators**, featuring real-time consignment tracking, multi-step freight booking, fleet dispatching, and automated invoicing.

---

## 🏗️ Architecture & Folder Structure

The project follows a clean, modular, and maintainable layered architecture:

```
src/
├── assets/                     # Static media assets (hero background photography, logos)
├── components/                 # Reusable UI presentation layer
│   ├── common/                 # Core design system primitives (StatusBadge, Loader, ErrorMessage)
│   ├── layout/                 # Layout wrappers (Navbar, Sidebar, Footer, DashboardLayout)
│   ├── tracking/               # Shared tracking domain views & progress steppers (TrackingView)
│   └── booking/                # Multi-step booking wizard sub-views
├── constants/                  # Single source of truth for domain constants
│   ├── roles.js                # Spring Security authority roles (ROLE_ADMIN, ROLE_CUSTOMER, ROLE_DELIVERY)
│   ├── shipmentStatus.js       # Lifecycle transit stages & milestone progression
│   ├── pricing.js              # Freight rates per kg, surcharges, and currency definitions
│   └── index.js                # Consolidated constants exports
├── context/                    # React Context providers
│   └── AuthContext.jsx         # Global authentication state, credentials cache, and session persistence
├── hooks/                      # Custom reusable React hooks
│   ├── useAuth.js              # Hook for consuming authentication context
│   ├── useLoginForm.js         # Unified auth form validation, role-checking, and submission logic
│   └── index.js                # Hooks barrel export
├── routes/                     # Centralized application routing & guards
│   ├── AppRoutes.jsx           # Clean route declarations with HOC dashboard layout wrappers
│   ├── ProtectedRoute.jsx      # Role-based route authorization guards
│   └── index.js                # Routes barrel export
├── services/                   # Clean API Service Layer (Axios client & domain REST endpoints)
│   ├── apiClient.js            # Configured Axios instance with Basic Auth and 401 interceptors
│   ├── authService.js          # /api/auth endpoints
│   ├── customerService.js      # /api/customers CRUD
│   ├── agentService.js         # /api/agents CRUD & on-duty toggle
│   ├── warehouseService.js     # /api/warehouses distribution hub queries
│   ├── shipmentService.js      # /api/shipments booking, status transitions & assignments
│   ├── trackingService.js      # /api/tracking checkpoint queries
│   ├── paymentService.js       # /api/payments billing & settlement
│   ├── userService.js          # /api/users admin registration
│   └── index.js                # Unified service exports (maintains backward compatibility)
├── admin/                      # Operations Admin portal pages & forms
├── agent/                      # Courier Delivery Agent portal pages
├── customer/                   # Customer client portal pages & self-service booking
├── App.jsx                     # Clean top-level app wrapper
├── main.jsx                    # React 18 DOM mount point (StrictMode)
└── app.css                     # Design system styles (Navy & Orange theme, responsive layout)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**

### Installation
```bash
# Clone the repository
git clone https://github.com/Dibbyansh100/Courier_Logistics_Project.git

# Navigate to frontend workspace
cd "LogisticAndTracking Frontend"

# Install dependencies
npm install
```

### Environment Variables
Configure `.env` (local development) or `.env.production` (live cloud deployment):

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL for Spring Boot backend | `http://localhost:8088` (local) / `https://logistic-backend-dbg1.onrender.com` (prod) |

### Development Server
```bash
npm run dev
```
Starts the local development server at `http://localhost:5173`.

### Production Build
```bash
npm run build
```
Generates a minified, tree-shaken production bundle into `dist/`.

---

## 🔐 Authentication & Role-Based Access Control (RBAC)

The platform supports 3 distinct roles verified against Spring Security authorities:

1. **Operations Administrator (`ROLE_ADMIN`)**
   - Access to full fleet dashboard, warehouse capacity monitoring, manual driver dispatching, customer records, and system-wide tracking.
   - Entry point: `/admin/login`

2. **Customer (`ROLE_CUSTOMER`)**
   - Self-service multi-step shipment booking wizard, live consignment tracking with timeline steppers, personal invoice payment status.
   - Entry point: `/customer/login` or `/login`

3. **Delivery Agent (`ROLE_DELIVERY`)**
   - Active task pickup queue, destination address details, cash-on-delivery collection, on-duty availability toggle, and checkpoint milestone updates.
   - Entry point: `/agent/login`

---

## 🔄 Data Flow Overview

1. **Authentication Flow**:
   User submits credentials $\rightarrow$ `useLoginForm` validates inputs $\rightarrow$ `authService.login()` posts to `/api/auth/login` $\rightarrow$ On success, `AuthContext` caches user object in memory and `sessionStorage` $\rightarrow$ Axios request interceptor attaches HTTP Basic Auth (`btoa(username:password)`) to all subsequent outbound requests.

2. **Booking Flow**:
   User completes 5-step `BookingWizard` $\rightarrow$ Real-time freight cost calculated $\rightarrow$ Package type mapped to backend enum (`BOX`, `PARCEL`, `ENVELOPE`) $\rightarrow$ `shipmentService.create()` dispatches payload $\rightarrow$ Server responds with generated tracking number (`TRK-*`).

3. **Tracking Flow**:
   User enters consignment number in `TrackingView` $\rightarrow$ `shipmentService.getByTrackingNumber()` fetches consignment record $\rightarrow$ `trackingService.getByShipment()` retrieves timeline checkpoints $\rightarrow$ Linear progress stepper calculates completed, active, and pending transit milestones.

---

## 🛠️ Code Quality & Refactoring Standards

- **Separation of Concerns**: UI components never make direct Axios calls; all HTTP operations flow through `src/services/`.
- **DRY Principle**: Duplicate tracking stepper logic (~750 LOC) unified into `<TrackingView />`.
- **Derived State**: Removed redundant `useState` + `useEffect` in authentication context to eliminate unnecessary re-renders.
- **Strict Backward Compatibility**: Root files (`Axios.jsx`, `AuthContext.jsx`, `StatusBadge.jsx`, etc.) serve as lightweight forwarding adapters so existing integrations never break.
- **Zero UI Regression**: 100% pixel-perfect preservation of colors, typography, animations, responsive breakpoints, and user flows.
