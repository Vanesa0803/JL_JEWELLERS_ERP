const dashboardModel = require("../models/dashboardModel.cjs");

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
                Number(summary.today_sales || 0),

            today_bills:
                Number(summary.today_bills || 0),

            revenue:
                Number(summary.revenue || 0),

            profit:
                Number(summary.profit || 0),

            cash_flow:
                Number(summary.cash_flow || 0),

            pending_orders: 
                Number(summary.pending_orders || 0),

            pending_payments:
                Number(summary.pending_payments || 0),

            inventory_quantity:
                Number(summary.inventory_quantity || 0),

            gold_rate:
                Number(summary.gold_rate || 0),

            silver_rate:
                Number(summary.silver_rate || 0)

        },

        sales_overview: salesOverview,

        recent_bills: recentBills,

        recent_activities: recentActivities,

        low_stock_products: lowStock,

        top_selling_products: topSelling


    };

};

const getSalesAnalytics = async (fromDate, toDate) => {

    const data =
        await dashboardModel.getSalesAnalytics(
            fromDate,
            toDate
        );

    return data.map(row => ({

        date: row.date,

        sales: Number(row.sales)

    }));

};

const getInventoryDashboard = async () => {

    const data =
        await dashboardModel.getInventoryDashboard();

    return {

        total_products:
            Number(data.total_products),

        total_stock:
            Number(data.total_stock),

        inventory_value:
            Number(data.inventory_value),

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