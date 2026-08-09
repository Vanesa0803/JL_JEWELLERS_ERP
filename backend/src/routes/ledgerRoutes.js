const express = require("express");

const router = express.Router();

const ledgerController =
    require("../controllers/ledgerController");


// ===============================
// CUSTOMER LEDGER
// ===============================

router.post(
    "/",
    ledgerController.createLedgerEntry
);

router.get(
    "/:customer_id/statement",
    ledgerController.getLedgerStatement
);

router.get(
    "/:customer_id/outstanding",
    ledgerController.getOutstandingBalance
);

router.get(
    "/:customer_id",
    ledgerController.getCustomerLedger
);


// ===============================
// SUPPLIER LEDGER
// ===============================

router.post(
    "/supplier",
    ledgerController.createSupplierLedgerEntry
);

router.get(
    "/supplier/:supplier_id/outstanding",
    ledgerController.getSupplierOutstandingBalance
);

router.get(
    "/supplier/:supplier_id",
    ledgerController.getSupplierLedger
);


module.exports = router;