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

import limiter from "./middleware/rateLimiter.js";

/* ------------------------------------------------------------------ *
 * Routes — auth (still in the legacy backend/ folder, one level up)
 * Moves into modules/auth during phase C.
 * ------------------------------------------------------------------ */
import authRoutes from "../routes/authRoutes.cjs";
import employeeRoutes from "../routes/employeeRoutes.cjs";

const app = express();

app.use(cors());
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

api.use("/auth", authRoutes);
api.use("/employees", employeeRoutes);

api.use("/bills", billRoutes);
api.use("/payments", paymentRoutes);
api.use("/ledger", ledgerRoutes);
api.use("/cashbook", cashBookRoutes);
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
