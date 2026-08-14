import express from "express";

const router = express.Router();

import reportController from "./report.controller.js";

router.get(
    "/sales",
    reportController.getSalesReport
);

router.get(
    "/gst",
    reportController.getGSTReport
);

router.get(
    "/customers",
    reportController.getCustomerReport
);

router.get(
    "/ledger",
    reportController.getLedgerReport
);

router.get(
    "/payments",
    reportController.getPaymentReport
);

router.get("/inventory", reportController.getInventoryReport);

/*
 * Exports live at /api/v1/export/{pdf,excel,csv}?report=<type>, not here.
 *
 * There used to be a second set of export routes on this router
 * (/reports/export/pdf and friends). They called exportService.exportPDF,
 * exportExcel and exportCSV — none of which exist; the service exports
 * exportToPDF, exportToExcel and exportToCSV. All three returned a 500 on
 * every request, so they had never worked.
 *
 * Removed rather than repaired (S2-11): two export surfaces doing the same job
 * drift apart, and the /export/* one is the one that works. Nothing could have
 * depended on these, since they never returned anything but an error.
 */

export default router;