import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware.js";
import { ApiResponse } from "./utils/ApiResponse.js";

const app = express();

// Global Middlewares
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  }),
);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // for general static files if needed
app.use("/uploads", express.static("uploads")); // serve uploads directory

// Health Check Endpoint
app.get("/api/v1/healthcheck", (req, res) => {
  res
    .status(200)
    .json(
      new ApiResponse(200, null, "JL Jewellers ERP Backend is up and running"),
    );
});

// Import Routes
import customerRouter from "./routes/customer.routes.js";
import customerDocumentRouter from "./routes/customerDocument.routes.js";
import customerNoteRouter from "./routes/customerNote.routes.js";
import customerLoyaltyRouter from "./routes/customerLoyalty.routes.js";
import customerAnalyticsRouter from "./routes/customerAnalytics.routes.js";
import customerLedgerRouter from "./routes/customerLedger.routes.js";
import supplierRouter from "./routes/supplier.routes.js";
import supplierDocumentRouter from "./routes/supplierDocument.routes.js";
import supplierLedgerRouter from "./routes/supplierLedger.routes.js";
import categoryRouter from "./routes/category.routes.js";
import subcategoryRouter from "./routes/subcategory.routes.js";
import designRouter from "./routes/design.routes.js";
import purityRouter from "./routes/purity.routes.js";
import metalTypeRouter from "./routes/metalType.routes.js";
import stoneTypeRouter from "./routes/stoneType.routes.js";
import productRouter from "./routes/product.routes.js";
import productVariantRouter from "./routes/productVariant.routes.js";
import purchaseOrderRouter from "./routes/purchaseOrder.routes.js";
import purchaseReturnRouter from "./routes/purchaseReturn.routes.js";
import grnRouter from "./routes/grn.routes.js";
import supplierPaymentRouter from "./routes/supplierPayment.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";
import inventoryAnalyticsRouter from "./routes/inventoryAnalytics.routes.js";

// Use Routes
app.use("/api/v1/customers", customerRouter);
// Note: customerDocumentRouter handles both /:customerId/documents and /documents/:documentId
// so we mount it on the same base path
app.use("/api/v1/customers", customerDocumentRouter);
app.use("/api/v1/customers", customerNoteRouter);
app.use("/api/v1/customers", customerLoyaltyRouter);
app.use("/api/v1/customers", customerAnalyticsRouter);
app.use("/api/v1/customers", customerLedgerRouter);

app.use("/api/v1/suppliers", supplierRouter);
app.use("/api/v1/suppliers", supplierLedgerRouter);
app.use("/api/v1/suppliers", supplierDocumentRouter);

app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subcategories", subcategoryRouter);

app.use("/api/v1/designs", designRouter);
app.use("/api/v1/purity", purityRouter);

app.use("/api/v1/metal-types", metalTypeRouter);
app.use("/api/v1/stone-types", stoneTypeRouter);

app.use("/api/v1/products", productRouter);
app.use("/api/v1/product-variants", productVariantRouter);

app.use("/api/v1/purchase-orders", purchaseOrderRouter);
app.use("/api/v1/purchase-returns", purchaseReturnRouter);
app.use("/api/v1/grn", grnRouter);

app.use("/api/v1/supplier-payments", supplierPaymentRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/inventory-analytics", inventoryAnalyticsRouter);

// Global Error Handler
app.use(errorHandler);

export { app };
