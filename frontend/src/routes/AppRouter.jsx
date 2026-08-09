import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import EditCustomer from "../pages/customers/EditCustomer";

import CreateBill from "../pages/billing/CreateBill";
import CancelOrder from "../pages/orders/CancelOrder";
import Payments from "../pages/payments/Payments";
import CustomerDetails from "../pages/customers/CustomerDetails";
import Delivery from "../pages/orders/Delivery";
import Customers from "../pages/customers/Customers";
import Orders from "../pages/orders/Orders";
import CreateOrder from "../pages/orders/CreateOrder";
import UpdateOrder from "../pages/orders/UpdateOrder";
import AllBills from "../pages/billing/AllBills";
import DraftBills from "../pages/billing/DraftBills";
import CompletedBills from "../pages/billing/CompletedBills";
import CancelledBills from "../pages/billing/CancelledBills";
import InvoiceHistory from "../pages/billing/InvoiceHistory";

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

        {/* ================= PUBLIC ================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ================= DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />


       {/* ================= BILLING ================= */}

<Route
  path="/billing"
  element={
    <DashboardLayout>
      <CreateBill />
    </DashboardLayout>
  }
/>

<Route
  path="/billing/all"
  element={
    <DashboardLayout>
      <AllBills />
    </DashboardLayout>
  }
/>

<Route
  path="/billing/drafts"
  element={
    <DashboardLayout>
      <DraftBills />
    </DashboardLayout>
  }
/>

<Route
  path="/billing/completed"
  element={
    <DashboardLayout>
      <CompletedBills />
    </DashboardLayout>
  }
/>

<Route
  path="/billing/cancelled"
  element={
    <DashboardLayout>
      <CancelledBills />
    </DashboardLayout>
  }
/>

<Route
  path="/billing/history"
  element={
    <DashboardLayout>
      <InvoiceHistory />
    </DashboardLayout>
  }
/>


        {/* ================= OTHER ERP MODULES ================= */}

  <Route
  path="/orders"
  element={
    <DashboardLayout>
      <Orders />
    </DashboardLayout>
  }
/>

<Route
  path="/orders/create"
  element={
    <DashboardLayout>
      <CreateOrder />
    </DashboardLayout>
  }
/>

<Route
  path="/orders/update"
  element={
    <DashboardLayout>
      <UpdateOrder />
    </DashboardLayout>
  }
/>

<Route
  path="/orders/cancel"
  element={
    <DashboardLayout>
      <CancelOrder />
    </DashboardLayout>
  }
/>
<Route
  path="/orders/delivery"
  element={
    <DashboardLayout>
      <Delivery />
    </DashboardLayout>
  }
/>


{/* other modules */}

<Route
  path="*"
  element={<Navigate to="/dashboard" replace />}
/>

<Route
  path="/payments"
  element={
    <DashboardLayout>
      <Payments />
    </DashboardLayout>
  }
/>

        <Route
  path="/customers"
  element={
    <DashboardLayout>
      <Customers />
    </DashboardLayout>
  }
/>

<Route
  path="/customers/:id"
  element={
    <DashboardLayout>
      <CustomerDetails />
    </DashboardLayout>
  }
/>

<Route
  path="/customers/:id/edit"
  element={
    <DashboardLayout>
      <EditCustomer />
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


        {/* ================= DEFAULT ================= */}

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