const incomeModel = require("../models/incomeModel");
const cashBookService = require("./cashBookService");

const createIncome = async (incomeData) => {

    const result = await incomeModel.createIncome({

        income_type: incomeData.income_type,

        amount: incomeData.amount,

        payment_method: incomeData.payment_method,

        income_date: incomeData.income_date,

        remarks: incomeData.remarks,

        created_by: incomeData.created_by || 1

    });

    const income = await incomeModel.getIncomeById(result.insertId);

    if (income.payment_method === "Cash") {

        await cashBookService.createCashEntry({

            transaction_type: "Cash In",

            source: "Manual",

            reference_id: income.income_id,

            customer_id: null,

            amount: income.amount,

            remarks: income.remarks,

            created_by: income.created_by || 1

        });

    }

    return {

        success: true,

        income_id: income.income_id,

        message: "Income created successfully."

    };

};

const getIncomeById = async (incomeId) => {

    const income = await incomeModel.getIncomeById(incomeId);

    if (!income) {

        throw new Error("Income not found.");

    }

    return income;

};

const getIncomeHistory = async () => {

    return await incomeModel.getIncomeHistory();

};

module.exports = {

    createIncome,
    getIncomeById,
    getIncomeHistory

};