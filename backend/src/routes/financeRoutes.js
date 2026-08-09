const express = require("express");

const router = express.Router();

const financeController =
    require("../controllers/financeController");


// Finance Summary Reports
router.get(
    "/summary/profit-loss",
    financeController.getProfitLossSummary
);

router.get(
    "/summary/cash-flow",
    financeController.getCashFlowSummary
);


// Detailed Finance Reports
router.get(
    "/profit-loss",
    financeController.getProfitLoss
);

router.get(
    "/cash-flow",
    financeController.getCashFlow
);

router.get(
    "/balance-sheet",
    financeController.getBalanceSheet
);

router.get(
    "/gst-summary",
    financeController.getGSTSummary
);

router.get(
    "/bank-accounts",
    financeController.getBankAccounts
);

router.get(
    "/outstanding-payables",
    financeController.getOutstandingPayables
);

router.get(
    "/dashboard",
    financeController.getFinanceDashboard
);

module.exports = router;