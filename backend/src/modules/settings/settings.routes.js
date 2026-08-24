import { Router } from "express";

import companyRoutes from "./company.routes.js";
import gstRoutes from "./gst.routes.js";
import invoiceRoutes from "./invoice.routes.js";
import barcodeRoutes from "./barcode.routes.js";
import metalRateRoutes from "./metalRate.routes.js";
import taxRoutes from "./tax.routes.js";
import discountRoutes from "./discount.routes.js";
import notificationRoutes from "./notification.routes.js";
import loginLogRoutes from "./loginLog.routes.js";
import activityLogRoutes from "./activityLog.routes.js";
import auditLogRoutes from "./auditLog.routes.js";
import errorLogRoutes from "./errorLog.routes.js";
import backupRoutes from "./backup.routes.js";

const router = Router();

router.use("/company", companyRoutes);

router.use("/gst", gstRoutes);

router.use("/invoice", invoiceRoutes);

router.use("/barcode", barcodeRoutes);

router.use("/metal-rates", metalRateRoutes);

router.use("/tax", taxRoutes);

router.use("/discount", discountRoutes);

router.use("/notifications", notificationRoutes);

router.use("/login-logs", loginLogRoutes);

router.use("/activity-logs", activityLogRoutes);

router.use("/audit-logs", auditLogRoutes);

router.use("/error-logs", errorLogRoutes);

router.use("/backup", backupRoutes);

export default router;