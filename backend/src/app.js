/**
 * The single Express application.
 *
 * Every business module below is ESM and lives under src/modules/. The
 * CommonJS bridge that carried the codebase through the merge is gone — see
 * MERGE_LOG.md for how it worked and why it is no longer needed.
 *
 * The only exception is auth/employees, which still sit in the legacy
 * backend/ folder one level up. They move into modules/auth in phase C.
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./middleware/errorHandler.js";
import { ApiResponse } from "./utils/ApiResponse.js";

/* ------------------------------------------------------------------ *
 * Business modules
 * ------------------------------------------------------------------ */
import billRoutes from "./modules/billing/bill.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import ledgerRoutes from "./modules/ledger/ledger.routes.js";
import cashBookRoutes from "./modules/finance/cashbook.routes.js";
import expenseRoutes from "./modules/finance/expense.routes.js";
import incomeRoutes from "./modules/finance/income.routes.js";
import financeRoutes from "./modules/finance/finance.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import reportRoutes from "./modules/reports/report.routes.js";
import exportRoutes from "./modules/reports/export.routes.js";
import analyticsRoutes from "./modules/reports/analytics.routes.js";
import customerOrderRoutes from "./modules/orders/order.routes.js";
import makerRoutes from "./modules/makers/maker.routes.js";
import makerAssignmentRoutes from "./modules/makers/assignment.routes.js";
import goldSchemeRoutes from "./modules/schemes/scheme.routes.js";
import financialSecurityRoutes from "./modules/security/security.routes.js";
import metalRateRoutes from "./modules/metalRates/metalRate.routes.js";
import bankLedgerRoutes from "./modules/finance/bankLedger.routes.js";
import notificationRoutes from "./modules/notifications/notification.routes.js";
import settingsRoutes from "./modules/settings/settings.routes.js";
/* ------------------------------------------------------------------ *
 * Phase B — modules recovered from developer-purvansh.
 *
 * This code was written months ago and had never been mounted anywhere, so
 * it has never run. Treat failures here as discovery rather than regression.
 * ------------------------------------------------------------------ */
import categoryRoutes from "./modules/masters/category.routes.js";
import subcategoryRoutes from "./modules/masters/subcategory.routes.js";
import designRoutes from "./modules/masters/design.routes.js";
import purityRoutes from "./modules/masters/purity.routes.js";
import metalTypeRoutes from "./modules/masters/metalType.routes.js";
import stoneTypeRoutes from "./modules/masters/stoneType.routes.js";

import customerRoutes from "./modules/customers/customer.routes.js";
import customerDocumentRoutes from "./modules/customers/customerDocument.routes.js";
import customerNoteRoutes from "./modules/customers/customerNote.routes.js";
import customerLoyaltyRoutes from "./modules/customers/customerLoyalty.routes.js";
import customerAnalyticsRoutes from "./modules/customers/customerAnalytics.routes.js";

import supplierRoutes from "./modules/suppliers/supplier.routes.js";
import supplierDocumentRoutes from "./modules/suppliers/supplierDocument.routes.js";

import productRoutes from "./modules/products/product.routes.js";
import productVariantRoutes from "./modules/products/productVariant.routes.js";

import inventoryRoutes from "./modules/inventory/inventory.routes.js";
import inventoryAnalyticsRoutes from "./modules/inventory/inventoryAnalytics.routes.js";

import purchaseOrderRoutes from "./modules/purchase/purchaseOrder.routes.js";
import grnRoutes from "./modules/purchase/grn.routes.js";
import purchaseReturnRoutes from "./modules/purchase/purchaseReturn.routes.js";
import supplierPaymentRoutes from "./modules/purchase/supplierPayment.routes.js";

import limiter from "./middleware/rateLimiter.js";

/* ------------------------------------------------------------------ *
 * Auth — phase C.
 *
 * Taken from auth-integration rather than the version that was running: it is
 * a strict superset, adding profile, logout, change-password and
 * reset-password on top of the same correct login. See the scour table in
 * MERGE_LOG.md.
 * ------------------------------------------------------------------ */
import authRoutes from "./modules/auth/auth.routes.js";
import authMiddleware from "./middleware/auth.js";

/* ------------------------------------------------------------------ *
 * HR — phase C.
 *
 * Salary is deliberately NOT here. Its four handlers return a hardcoded
 * {success: true} and never touch the database, so merging it would mean
 * writing it. It stays on auth-integration until feature work resumes.
 * ------------------------------------------------------------------ */
import employeeRoutes from "./modules/hr/employee.routes.js";
import departmentRoutes from "./modules/hr/department.routes.js";
import attendanceRoutes from "./modules/hr/attendance.routes.js";
import salaryRoutes from "./modules/hr/salary.routes.js";

const app = express();

/*
 * CORS is restricted to the app's own dev server (S1-6).
 *
 * This was a bare `cors()`, which allows every origin. It mattered less than
 * it looks — the API is bound to loopback, and the app itself goes through the
 * Vite proxy so its requests are same-origin — but "allow everyone" is the
 * wrong default to leave sitting in a file, especially in a project where the
 * next person may well change the bind address.
 *
 * Set CORS_ORIGIN in backend/.env (comma-separated) if the app is ever served
 * from somewhere else.
 */
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // No origin: same-origin requests, curl, and the Vite proxy itself.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(limiter);

/*
 * Uploaded customer and supplier documents are written to uploads/ by multer
 * and served back from here. The folder is git-ignored — these are real
 * customer KYC documents and must never be committed.
 *
 * NOTE: this is served without any authentication, so anyone who can reach the
 * API can fetch any uploaded document by guessing its path. Acceptable only
 * because the API is bound to loopback (see server.js). Revisit alongside
 * S1-3 if the API is ever exposed.
 */
app.use("/uploads", express.static("uploads"));

/* ------------------------------------------------------------------ *
 * API
 *
 * Everything sits under /api/v1 (settled decision 4 in MERGE_PLAN.md).
 * /api/* is still served as well so nothing breaks while the frontend and the
 * remaining modules catch up. The alias is temporary and tracked in
 * MERGE_LOG.md.
 * ------------------------------------------------------------------ */
const api = express.Router();

/*
 * Auth mounts FIRST, and guards itself internally: /login is public and rate
 * limited, everything else in it already requires a token.
 */
api.use("/auth", authRoutes);

/* ------------------------------------------------------------------ *
 * S1-3 — everything below this line requires a valid token.
 *
 * Until now exactly one route in the application checked who you were.
 * Bills, payments, customer KYC documents, stock and the cash book were all
 * readable and writable by anyone who could reach the port. The only thing
 * standing in the way was that the server binds to loopback, which is a
 * deployment accident rather than a security control.
 *
 * This is deliberately mounted on the router rather than added route by
 * route. Forty-one route files, each needing the middleware in its own list,
 * is forty-one chances to forget one — and a forgotten route fails OPEN,
 * silently, and looks perfectly fine in testing. Here, being protected is the
 * default and an exemption has to be written above this line where it is
 * visible.
 *
 * Note this does NOT cover /uploads, which is served off the app rather than
 * this router and is still public. See the note there.
 * ------------------------------------------------------------------ */
api.use(authMiddleware);
api.use("/settings", settingsRoutes);

api.use("/employees", employeeRoutes);
api.use("/departments", departmentRoutes);
api.use("/attendance", attendanceRoutes);
api.use("/salaries", salaryRoutes);

api.use("/bills", billRoutes);
api.use("/payments", paymentRoutes);
api.use("/ledger", ledgerRoutes);
api.use("/cashbook", cashBookRoutes);
api.use("/bank-ledger", bankLedgerRoutes);
api.use("/expenses", expenseRoutes);
api.use("/income", incomeRoutes);
api.use("/finance", financeRoutes);
api.use("/dashboard", dashboardRoutes);
api.use("/reports", reportRoutes);
api.use("/export", exportRoutes);
api.use("/analytics", analyticsRoutes);
api.use("/customer-orders", customerOrderRoutes);
api.use("/makers", makerRoutes);
api.use("/maker-assignments", makerAssignmentRoutes);
api.use("/gold-schemes", goldSchemeRoutes);
api.use("/financial-security", financialSecurityRoutes);
api.use("/metal-rates", metalRateRoutes);
api.use("/notifications", notificationRoutes);

// Phase B — masters
api.use("/categories", categoryRoutes);
api.use("/subcategories", subcategoryRoutes);
api.use("/designs", designRoutes);
api.use("/purity", purityRoutes);
api.use("/metal-types", metalTypeRoutes);
api.use("/stone-types", stoneTypeRoutes);

/*
 * Phase B — customers.
 *
 * Five routers deliberately share the /customers base. Each owns a different
 * sub-path (/:id/documents, /:id/notes, /:id/loyalty/*, /:id/purchase-history)
 * and Express tries them in order, so the effect is one resource split across
 * five focused files rather than one large router.
 *
 * The customer LEDGER is NOT here. Two implementations existed and Riya's was
 * chosen — it uses the real customer_ledger table, whereas this branch's
 * version derived balances from customer_orders as a documented stopgap.
 * It stays mounted at /ledger. See the duplicate-resolution table in
 * MERGE_LOG.md.
 */
api.use("/customers", customerRoutes);
api.use("/customers", customerDocumentRoutes);
api.use("/customers", customerNoteRoutes);
api.use("/customers", customerLoyaltyRoutes);
api.use("/customers", customerAnalyticsRoutes);

/*
 * Phase B — suppliers. Same split-router shape as customers.
 * The supplier LEDGER is not here either: Riya's covers all six ledger types
 * and stays mounted at /ledger/supplier.
 */
api.use("/suppliers", supplierRoutes);
api.use("/suppliers", supplierDocumentRoutes);
// Supplier payments land with the purchase module — a payment is made against
// a purchase order, and its service imports PurchaseOrderRepository.

// Phase B — products
api.use("/products", productRoutes);
api.use("/product-variants", productVariantRoutes);

// Phase B — inventory
api.use("/inventory", inventoryRoutes);
api.use("/inventory-analytics", inventoryAnalyticsRoutes);

/*
 * Phase B — purchase. Supplier payments live here rather than with suppliers:
 * a payment is settled against a purchase order, so its service imports
 * PurchaseOrderRepository.
 */
api.use("/purchase-orders", purchaseOrderRoutes);
api.use("/grn", grnRoutes);
api.use("/purchase-returns", purchaseReturnRoutes);
api.use("/supplier-payments", supplierPaymentRoutes);

app.use("/api/v1", api);
app.use("/api", api); // temporary alias — remove once the frontend moves to /api/v1

app.get("/", (req, res) => {
  res.json(new ApiResponse(200, { service: "JL Jewellers ERP" }, "Backend running"));
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `No such endpoint: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

export default app;
