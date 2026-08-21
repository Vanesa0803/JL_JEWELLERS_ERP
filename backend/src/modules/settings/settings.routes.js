import { Router } from "express";

import companyRoutes from "./company.routes.js";
import gstRoutes from "./gst.routes.js";
import invoiceRoutes from "./invoice.routes.js";
import barcodeRoutes from "./barcode.routes.js";

const router = Router();

router.use("/company", companyRoutes);

router.use("/gst", gstRoutes);

router.use("/invoice", invoiceRoutes);

router.use("/barcode", barcodeRoutes);

export default router;