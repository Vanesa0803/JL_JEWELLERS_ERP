import express from "express";

const router = express.Router();

import ledgerController from "./ledger.controller.js";


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


export default router;