const express = require("express");

const router = express.Router();

const ledgerController = require("../controllers/ledgerController");

router.post("/", ledgerController.createLedgerEntry);

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

module.exports = router;