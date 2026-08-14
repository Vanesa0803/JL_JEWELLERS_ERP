import express from "express";
const router = express.Router();

import dashboardController from "./dashboard.controller.js";

router.get("/", dashboardController.getDashboardSummary);

router.get("/sales-analytics", dashboardController.getSalesAnalytics);

router.get("/inventory", dashboardController.getInventoryDashboard);

router.get("/stock-movement", dashboardController.getStockMovement);

export default router;