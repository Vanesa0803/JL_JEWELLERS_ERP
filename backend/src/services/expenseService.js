const expenseModel = require("../models/expenseModel");
const cashBookService = require("./cashBookService");

const createExpense = async (expenseData) => {

    const result = await expenseModel.createExpense({

        expense_type: expenseData.expense_type,

        amount: expenseData.amount,

        payment_method: expenseData.payment_method,

        expense_date: expenseData.expense_date,

        remarks: expenseData.remarks,

        created_by: expenseData.created_by || 1

    });

    const expense = await expenseModel.getExpenseById(
        result.insertId
    );

    if (expense.payment_method === "Cash") {

        await cashBookService.createCashEntry({

            transaction_type: "Cash Out",

            source: "Expense",

            reference_id: expense.expense_id,

            customer_id: null,

            amount: expense.amount,

            remarks: expense.remarks || "Expense Paid",

            created_by: expense.created_by || 1

        });

    }

    return {

        success: true,

        expense_id: expense.expense_id,

        message: "Expense created successfully."

    };

};

const getExpenseById = async (expenseId) => {

    const expense = await expenseModel.getExpenseById(expenseId);

    if (!expense) {

        throw new Error("Expense not found.");

    }

    return expense;

};

const getExpenseHistory = async () => {

    return await expenseModel.getExpenseHistory();

};

module.exports = {

    createExpense,
    getExpenseById,
    getExpenseHistory

};