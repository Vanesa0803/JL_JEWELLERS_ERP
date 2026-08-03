const express = require("express");

const router = express.Router();

const reportController =
require("../controllers/reportController");

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

module.exports = router;