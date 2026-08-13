const financeModel = require("../models/financeModel.cjs");

const getProfitLossSummary = async () => {

    const data = await financeModel.getProfitLossSummary();

    return {

        total_income: Number(data.total_income),

        total_expense: Number(data.total_expense),

        net_profit:
            Number(data.total_income)
            -
            Number(data.total_expense),

        total_cash_in: Number(data.total_cash_in),

        total_cash_out: Number(data.total_cash_out),

        cash_balance:
            Number(data.total_cash_in)
            -
            Number(data.total_cash_out)

    };

};

const getCashFlowSummary = async () => {

    const data =
        await financeModel.getCashFlowSummary();

    const cashIn =

        Number(data.bill_payments)

        +

        Number(data.advance_payments)

        +

        Number(data.manual_income);

    const cashOut =

        Number(data.expenses)

        +

        Number(data.refunds);

    return {

        cash_in: {

            bill_payments:
                Number(data.bill_payments),

            advance_payments:
                Number(data.advance_payments),

            manual_income:
                Number(data.manual_income),

            total: cashIn

        },

        cash_out: {

            expenses:
                Number(data.expenses),

            refunds:
                Number(data.refunds),

            total: cashOut

        },

        net_cash_flow:

            cashIn

            -

            cashOut

    };

};

const getBankAccounts = async () => {

    return await financeModel.getBankAccounts();

};

const getGSTSummary = async (fromDate, toDate) => {

    return await financeModel.getGSTSummary(
        fromDate,
        toDate
    );

};

const getProfitLoss = async (fromDate, toDate) => {

    return await financeModel.getProfitLoss(
        fromDate,
        toDate
    );

};

const getBalanceSheet = async (fromDate, toDate) => {

    return await financeModel.getBalanceSheet(
        fromDate,
        toDate
    );

};

const getCashFlow = async (fromDate, toDate) => {

    return await financeModel.getCashFlow(
        fromDate,
        toDate
    );

};

const getOutstandingPayables = async (fromDate, toDate) => {

    return await financeModel.getOutstandingPayables(
        fromDate,
        toDate
    );

};

const getFinanceDashboard = async () => {

    const [
        profitLossSummary,
        cashFlowSummary,
        bankAccounts,
        gstSummary,
        balanceSheet,
        outstandingPayables
    ] = await Promise.all([

        financeModel.getProfitLossSummary(),

        financeModel.getCashFlowSummary(),

        financeModel.getBankAccounts(),

        financeModel.getGSTSummary(),

        financeModel.getBalanceSheet(),

        financeModel.getOutstandingPayables()

    ]);

    const cashIn =
        Number(cashFlowSummary.bill_payments) +
        Number(cashFlowSummary.advance_payments) +
        Number(cashFlowSummary.manual_income);

    const cashOut =
        Number(cashFlowSummary.expenses) +
        Number(cashFlowSummary.refunds);

    return {

        profit_loss: {

            total_income:
                Number(profitLossSummary.total_income),

            total_expense:
                Number(profitLossSummary.total_expense),

            net_profit:
                Number(profitLossSummary.total_income) -
                Number(profitLossSummary.total_expense)

        },

        cash_flow: {

            cash_in: cashIn,

            cash_out: cashOut,

            net_cash_flow:
                cashIn - cashOut

        },

        cash_flow_breakdown: {

            bill_payments:
                Number(cashFlowSummary.bill_payments),

            advance_payments:
                Number(cashFlowSummary.advance_payments),

            manual_income:
                Number(cashFlowSummary.manual_income),

            expenses:
                Number(cashFlowSummary.expenses),

            refunds:
                Number(cashFlowSummary.refunds)

        },

        balance_sheet: balanceSheet,

        bank_accounts: bankAccounts,

        gst_summary: gstSummary,

        outstanding_payables: outstandingPayables

    };

};



module.exports = {

    getProfitLossSummary,
    getCashFlowSummary,
    getBankAccounts,
    getGSTSummary,
    getProfitLoss,
    getBalanceSheet,
    getCashFlow,
    getOutstandingPayables,
    getFinanceDashboard

};