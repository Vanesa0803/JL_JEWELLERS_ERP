const express = require("express");

const router = express.Router();

const reportController =
require("../controllers/reportController.cjs");

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

router.get("/export/pdf", reportController.exportPDF);

router.get("/export/excel", reportController.exportExcel);

router.get("/export/csv", reportController.exportCSV);

module.exports = router;