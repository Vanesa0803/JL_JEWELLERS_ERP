const cashBookModel = require("../models/cashBookModel.cjs");

const createCashEntry = async (data) => {

    await cashBookModel.createEntry({

        transaction_type: data.transaction_type,

        source: data.source,

        reference_id: data.reference_id,

        customer_id: data.customer_id,

        amount: data.amount,

        remarks: data.remarks,

        created_by: data.created_by || 1

    });

};

const getCashBookStatement = async () => {

    const entries =
        await cashBookModel.getCashBookStatement();

    let openingBalance = 0;

    let runningBalance = openingBalance;

    let totalCashIn = 0;

    let totalCashOut = 0;

    const transactions = entries.map(entry => {

        if (entry.transaction_type === "Cash In") {

            runningBalance += Number(entry.amount);

            totalCashIn += Number(entry.amount);

        }

        else {

            runningBalance -= Number(entry.amount);

            totalCashOut += Number(entry.amount);

        }

        return {

            ...entry,

            running_balance: runningBalance

        };

    });

    return {

        opening_balance: openingBalance,

        total_cash_in: totalCashIn,

        total_cash_out: totalCashOut,

        closing_balance: runningBalance,

        transactions

    };

};

module.exports = {

    createCashEntry,
    getCashBookStatement

};