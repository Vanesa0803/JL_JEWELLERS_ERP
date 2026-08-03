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

module.exports = router;