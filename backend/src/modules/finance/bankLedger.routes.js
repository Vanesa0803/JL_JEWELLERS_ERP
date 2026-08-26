import express from "express";

const router = express.Router();

import bankLedgerController from "./bankLedger.controller.js";

router.post(
    "/",
    bankLedgerController.createBankLedgerEntry
);

router.get(
    "/:bank_account_id",
    bankLedgerController.getBankLedger
);

export default router;
