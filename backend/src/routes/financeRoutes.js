const express = require("express");

const router = express.Router();

const financeController =
require("../controllers/financeController");

router.get(

    "/profit-loss",

    financeController.getProfitLossSummary

);

router.get(

    "/cash-flow",

    financeController.getCashFlowSummary

);

router.get(
    "/bank-accounts",
    financeController.getBankAccounts
);

router.get(
    "/gst-summary",
    financeController.getGSTSummary
);

router.get(
    "/profit-loss",
    financeController.getProfitLoss
);

router.get(
    "/balance-sheet",
    financeController.getBalanceSheet
);

router.get(
    "/cash-flow",
    financeController.getCashFlow
);

router.get(
    "/outstanding-payables",
    financeController.getOutstandingPayables
);

module.exports = router;