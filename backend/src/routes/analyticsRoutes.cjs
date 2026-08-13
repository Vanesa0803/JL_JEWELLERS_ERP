const express = require("express");

const router = express.Router();

const analyticsController =
require("../controllers/analyticsController.cjs");

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

module.exports = router;