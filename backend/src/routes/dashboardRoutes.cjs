const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController.cjs");

router.get("/", dashboardController.getDashboardSummary);

router.get("/sales-analytics", dashboardController.getSalesAnalytics);

router.get("/inventory", dashboardController.getInventoryDashboard);

router.get("/stock-movement", dashboardController.getStockMovement);

module.exports = router;