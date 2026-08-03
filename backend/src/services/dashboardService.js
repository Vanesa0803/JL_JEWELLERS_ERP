const dashboardModel = require("../models/dashboardModel");

const getDashboardSummary = async () => {

    const [
        summary,
        salesOverview,
        recentBills,
        recentActivities,
        lowStock,
        topSelling
    
    ] = await Promise.all([

        dashboardModel.getDashboardSummary(),
        dashboardModel.getSalesOverview(),
        dashboardModel.getRecentBills(),
        dashboardModel.getRecentActivities(),
        dashboardModel.getLowStockProducts(),
        dashboardModel.getTopSellingProducts()

    ]);

    return {

        summary: {

            today_sales:
                Number(summary.today_sales),

            today_bills:
                Number(summary.today_bills),

            revenue:
                Number(summary.revenue),

            profit:
                Number(summary.profit),

            cash_flow:
                Number(summary.cash_flow),

            pending_orders: 0,

            pending_payments:
                Number(summary.pending_payments),

            inventory_value:
                Number(summary.inventory_quantity),

            gold_rate:
                Number(summary.gold_rate),

            silver_rate:
                Number(summary.silver_rate)

        },

        sales_overview: salesOverview,

        recent_bills: recentBills,

        recent_activities: recentActivities,

        low_stock_products: lowStock,

        top_selling_products: topSelling


    };

};

const getSalesAnalytics = async () => {

    return dashboardModel.getSalesAnalytics();

};

const getInventoryDashboard = async () => {

    const data = await dashboardModel.getInventoryDashboard();

    return {

        total_products:
            Number(data.total_products),

        total_stock:
            Number(data.total_stock),

        low_stock_products:
            Number(data.low_stock_products),

        out_of_stock:
            Number(data.out_of_stock),

        purchased_quantity:
            Number(data.purchased_quantity),

        sold_quantity:
            Number(data.sold_quantity),

        returned_quantity:
            Number(data.returned_quantity),

        repair_quantity:
            Number(data.repair_quantity)

    };

};

const getStockMovement = async () => {

    const data = await dashboardModel.getStockMovement();

    return {

        purchased_quantity:
            Number(data.purchased_quantity),

        sold_quantity:
            Number(data.sold_quantity),

        returned_quantity:
            Number(data.returned_quantity),

        repair_quantity:
            Number(data.repair_quantity)

    };

};

module.exports = {

    getDashboardSummary,
    getSalesAnalytics,
    getInventoryDashboard,
    getStockMovement


};