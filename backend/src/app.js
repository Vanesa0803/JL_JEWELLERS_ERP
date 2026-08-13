/**
 * The single Express application.
 *
 * MID-MERGE STATE — read this before being confused by the .cjs imports.
 *
 * The backend is being consolidated from three separate codebases into one
 * module structure (see MERGE_PLAN.md and MERGE_LOG.md). The finance modules
 * are still CommonJS and are bridged in as `.cjs` files; they get converted to
 * ESM one module at a time, each verified against a known baseline before the
 * next one starts. When the last `.cjs` disappears, so does this comment.
 *
 * Node can import CommonJS from ESM, which is what makes the incremental
 * conversion possible without the app ever being broken.
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./middleware/errorHandler.js";
import { ApiResponse } from "./utils/ApiResponse.js";

/* ------------------------------------------------------------------ *
 * Routes — finance side (bridged CommonJS, awaiting conversion)
 * ------------------------------------------------------------------ */
import billRoutes from "./routes/billRoutes.cjs";
import paymentRoutes from "./routes/paymentRoutes.cjs";
import ledgerRoutes from "./routes/ledgerRoutes.cjs";
import cashBookRoutes from "./routes/cashBookRoutes.cjs";
import expenseRoutes from "./routes/expenseRoutes.cjs";
import incomeRoutes from "./routes/incomeRoutes.cjs";
import financeRoutes from "./routes/financeRoutes.cjs";
import dashboardRoutes from "./routes/dashboardRoutes.cjs";
import reportRoutes from "./routes/reportRoutes.cjs";
import exportRoutes from "./routes/exportRoutes.cjs";
import analyticsRoutes from "./routes/analyticsRoutes.cjs";
import customerOrderRoutes from "./routes/customerOrderRoutes.cjs";
import makerRoutes from "./routes/makerRoutes.cjs";
import makerAssignmentRoutes from "./routes/makerAssignmentRoutes.cjs";
import goldSchemeRoutes from "./routes/goldSchemeRoutes.cjs";
import financialSecurityRoutes from "./routes/financialSecurityRoutes.cjs";
import limiter from "./middleware/rateLimiter.cjs";

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
