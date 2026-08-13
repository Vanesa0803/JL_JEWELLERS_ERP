import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";

import EditCustomer from "../pages/customers/EditCustomer";
import CustomerDetails from "../pages/customers/CustomerDetails";
import Customers from "../pages/customers/Customers";

import Suppliers from "../pages/suppliers/Suppliers";

import CreateBill from "../pages/billing/CreateBill";
import AllBills from "../pages/billing/AllBills";
import DraftBills from "../pages/billing/DraftBills";
import CompletedBills from "../pages/billing/CompletedBills";
import CancelledBills from "../pages/billing/CancelledBills";
import InvoiceHistory from "../pages/billing/InvoiceHistory";

import Orders from "../pages/orders/Orders";
import CreateOrder from "../pages/orders/CreateOrder";
import UpdateOrder from "../pages/orders/UpdateOrder";
import CancelOrder from "../pages/orders/CancelOrder";
import Delivery from "../pages/orders/Delivery";

import Payments from "../pages/payments/Payments";


/* =========================================================
   PLACEHOLDER PAGE
========================================================= */

const PlaceholderPage = ({ title }) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#2B2622]">
        {title}
      </h1>

      <p className="mt-2 text-sm text-[#85786D]">
        This module is under development.
      </p>
    </div>
  );
};


/* =========================================================
   PRIVATE PAGE WRAPPER

   Every page below the login screen needs two things:
     1. a logged-in check   (ProtectedRoute)
     2. the sidebar + topbar chrome  (DashboardLayout)

   Rather than repeating both on all 20+ routes, they are combined here once.
========================================================= */

const Private = ({ children }) => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
};


/* =========================================================
   APP ROUTER
========================================================= */

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
            PUBLIC
        ================================================= */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />


        {/* =================================================
            DASHBOARD
        ================================================= */}

        <Route
          path="/dashboard"
          element={
            <Private>
              <Dashboard />
            </Private>
          }
        />


        {/* =================================================
            BILLING
        ================================================= */}

        <Route
          path="/billing"
          element={
            <Private>
              <CreateBill />
            </Private>
          }
        />

        <Route
          path="/billing/all"
          element={
            <Private>
              <AllBills />
            </Private>
          }
        />

        <Route
          path="/billing/drafts"
          element={
            <Private>
              <DraftBills />
            </Private>
          }
        />

        <Route
          path="/billing/completed"
          element={
            <Private>
              <CompletedBills />
            </Private>
          }
        />

        <Route
          path="/billing/cancelled"
          element={
            <Private>
              <CancelledBills />
            </Private>
          }
        />

        <Route
          path="/billing/history"
          element={
            <Private>
              <InvoiceHistory />
            </Private>
          }
        />


        {/* =================================================
            ORDERS
        ================================================= */}

        <Route
          path="/orders"
          element={
            <Private>
              <Orders />
            </Private>
          }
        />

        <Route
          path="/orders/create"
          element={
            <Private>
              <CreateOrder />
            </Private>
          }
        />

        <Route
          path="/orders/update"
          element={
            <Private>
              <UpdateOrder />
            </Private>
          }
        />

        <Route
          path="/orders/cancel"
          element={
            <Private>
              <CancelOrder />
            </Private>
          }
        />

        <Route
          path="/orders/delivery"
          element={
            <Private>
              <Delivery />
            </Private>
          }
        />


        {/* =================================================
            PAYMENTS
        ================================================= */}

        <Route
          path="/payments"
          element={
            <Private>
              <Payments />
            </Private>
          }
        />


        {/* =================================================
            CUSTOMERS
        ================================================= */}

        <Route
          path="/customers"
          element={
            <Private>
              <Customers />
            </Private>
          }
        />

        <Route
          path="/customers/:id"
          element={
            <Private>
              <CustomerDetails />
            </Private>
          }
        />

        <Route
          path="/customers/:id/edit"
          element={
            <Private>
              <EditCustomer />
            </Private>
          }
        />


        {/* =================================================
            SUPPLIERS
        ================================================= */}

        <Route
          path="/suppliers"
          element={
            <Private>
              <Suppliers />
            </Private>
          }
        />


        {/* =================================================
            OTHER ERP MODULES
        ================================================= */}

        <Route
          path="/makers"
          element={
            <Private>
              <PlaceholderPage title="Makers / Karigars" />
            </Private>
          }
        />

        <Route
          path="/gold-schemes"
          element={
            <Private>
              <PlaceholderPage title="Gold Schemes" />
            </Private>
          }
        />

        <Route
          path="/inventory"
          element={
            <Private>
              <PlaceholderPage title="Inventory" />
            </Private>
          }
        />

        <Route
          path="/ledgers"
          element={
            <Private>
              <PlaceholderPage title="Ledgers" />
            </Private>
          }
        />

        <Route
          path="/finance"
          element={
            <Private>
              <PlaceholderPage title="Finance" />
            </Private>
          }
        />

        <Route
          path="/reports"
          element={
            <Private>
              <PlaceholderPage title="Reports" />
            </Private>
          }
        />

        <Route
          path="/notifications"
          element={
            <Private>
              <PlaceholderPage title="Notifications" />
            </Private>
          }
        />

        <Route
          path="/settings"
          element={
            <Private>
              <PlaceholderPage title="Settings" />
            </Private>
          }
        />


        {/* =================================================
            DEFAULT
            KEEP THIS LAST
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;