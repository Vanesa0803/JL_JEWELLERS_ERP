import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";

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

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />

        {/* ERP Modules */}
        <Route
          path="/billing"
          element={
            <DashboardLayout>
              <PlaceholderPage title="Billing" />
            </DashboardLayout>
          }
        />

        <Route
          path="/orders"
          element={
            <DashboardLayout>
              <PlaceholderPage title="Orders" />
            </DashboardLayout>
          }
        />

        <Route
          path="/payments"
          element={
            <DashboardLayout>
              <PlaceholderPage title="Payments" />
            </DashboardLayout>
          }
        />

        <Route
          path="/customers"
          element={
            <DashboardLayout>
              <PlaceholderPage title="Customers" />
            </DashboardLayout>
          }
        />

        <Route
          path="/suppliers"
          element={
            <DashboardLayout>
              <PlaceholderPage title="Suppliers" />
            </DashboardLayout>
          }
        />

        <Route
          path="/makers"
          element={
            <DashboardLayout>
              <PlaceholderPage title="Makers / Karigars" />
            </DashboardLayout>
          }
        />

        <Route
          path="/gold-schemes"
          element={
            <DashboardLayout>
              <PlaceholderPage title="Gold Schemes" />
            </DashboardLayout>
          }
        />

        <Route
          path="/inventory"
          element={
            <DashboardLayout>
              <PlaceholderPage title="Inventory" />
            </DashboardLayout>
          }
        />

        <Route
          path="/ledgers"
          element={
            <DashboardLayout>
              <PlaceholderPage title="Ledgers" />
            </DashboardLayout>
          }
        />

        <Route
          path="/finance"
          element={
            <DashboardLayout>
              <PlaceholderPage title="Finance" />
            </DashboardLayout>
          }
        />

        <Route
          path="/reports"
          element={
            <DashboardLayout>
              <PlaceholderPage title="Reports" />
            </DashboardLayout>
          }
        />

        <Route
          path="/notifications"
          element={
            <DashboardLayout>
              <PlaceholderPage title="Notifications" />
            </DashboardLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <DashboardLayout>
              <PlaceholderPage title="Settings" />
            </DashboardLayout>
          }
        />

        {/* Default */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;