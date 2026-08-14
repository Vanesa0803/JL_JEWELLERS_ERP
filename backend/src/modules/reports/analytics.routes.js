import express from "express";

const router = express.Router();

import analyticsController from "./analytics.controller.js";

router.get(
    "/sales-target",
    analyticsController.getSalesTarget
);

router.get(
    "/monthly-revenue",
    analyticsController.getMonthlyRevenue
);

router.get(
    "/yearly-revenue",
    analyticsController.getYearlyRevenue
);

router.get(
    "/revenue-comparison",
    analyticsController.getRevenueComparison

);

router.get(
    "/profit-trends",
    analyticsController.getProfitTrends
);

router.get(
    "/customer-analytics",
    analyticsController.getCustomerAnalytics
);

router.get(
    "/inventory-analytics",
    analyticsController.getInventoryAnalytics
);

router.get(
    "/financial-analytics",
    analyticsController.getFinancialAnalytics
);

export default router;