const financeModel = require("../models/financeModel");

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

const getGSTSummary = async () => {

    return await financeModel.getGSTSummary();

};

const getProfitLoss = async () => {

    return await financeModel.getProfitLoss();

};

const getBalanceSheet = async () => {

    return await financeModel.getBalanceSheet();

};

const getCashFlow = async () => {

    return await financeModel.getCashFlow();

};

const getOutstandingPayables = async () => {

    return await financeModel.getOutstandingPayables();

};

module.exports = {

    getProfitLossSummary,
    getCashFlowSummary,
    getBankAccounts,
    getGSTSummary,
    getProfitLoss,
    getBalanceSheet,
    getCashFlow,
    getOutstandingPayables

};