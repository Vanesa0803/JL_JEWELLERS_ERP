const analyticsModel =
require("../models/analyticsModel.cjs");

const getSalesTarget = async () => {

    const data =
    await analyticsModel.getSalesTarget();

    return {

        monthly_target:
            Number(data.monthly_target),

        current_sales:
            Number(data.current_sales),

        achievement_percentage:
            Number(data.achievement_percentage),

        remaining_target:
            Number(data.remaining_target)

    };

};

const getMonthlyRevenue = async () => {

    const data =
        await analyticsModel.getMonthlyRevenue();

    return data.map(item => ({

        month: item.month,

        revenue: Number(item.revenue)

    }));

};

const getYearlyRevenue = async () => {

    const data =
        await analyticsModel.getYearlyRevenue();

    return data.map(item => ({

        year: Number(item.year),

        revenue: Number(item.revenue)

    }));

};

const getRevenueComparison = async () => {

    const data =
        await analyticsModel.getRevenueComparison();

    const current =
        Number(data.current_month || 0);

    const previous =
        Number(data.previous_month || 0);

    const difference =
        current - previous;

    const growth =
        previous > 0
            ? (difference / previous) * 100
            : 0;

    return {

        current_month:
            current,

        previous_month:
            previous,

        difference:
            Number(difference.toFixed(2)),

        growth_percentage:
            Number(growth.toFixed(2))

    };

};

const getProfitTrends = async () => {

    const data =
        await analyticsModel.getProfitTrends();

    return data.map(item => {

        const revenue =
            Number(item.revenue);

        const expenses =
            Number(item.expenses);

        return {

            year: Number(item.year),

            month: item.month,

            revenue,

            expenses,

            profit: Number((revenue - expenses).toFixed(2))

        };

    });

};

const getCustomerAnalytics = async () => {

    const data =
        await analyticsModel.getCustomerAnalytics();

    return {

        total_customers:
            Number(data.total_customers),

        new_customers:
            Number(data.new_customers),

        active_customers:
            Number(data.active_customers),

        average_purchase:
            Number(Number(data.average_purchase).toFixed(2))

    };

};

const getInventoryAnalytics = async () => {

    const data =
        await analyticsModel.getInventoryAnalytics();

    return {

        total_products:
            Number(data.total_products),

        total_stock:
            Number(data.total_stock),

        low_stock:
            Number(data.low_stock),

        out_of_stock:
            Number(data.out_of_stock),

        average_stock:
            Number(data.average_stock)

    };

};

const getFinancialAnalytics = async () => {

    const data =
        await analyticsModel.getFinancialAnalytics();

    const income =
        Number(data.total_income);

    const expenses =
        Number(data.total_expenses);

    return {

        total_income:
            income,

        total_expenses:
            expenses,

        net_profit:
            Number((income - expenses).toFixed(2)),

        cash_income:
            Number(data.cash_income),

        upi_income:
            Number(data.upi_income),

        card_income:
            Number(data.card_income),

        bank_transfer_income:
            Number(data.bank_transfer_income)

    };

};

module.exports = {

    getSalesTarget,
    getMonthlyRevenue,
    getYearlyRevenue,
    getRevenueComparison,
    getProfitTrends,
    getCustomerAnalytics,
    getInventoryAnalytics,
    getFinancialAnalytics

};