const expenseService = require("../services/expenseService");

const createExpense = async (req, res) => {

    try {

        const result = await expenseService.createExpense(
            req.body
        );

        res.status(201).json({

            success: true,

            data: result

        });

    }
    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

const getExpenseById = async (req, res) => {

    try {

        const result = await expenseService.getExpenseById(
            req.params.expense_id
        );

        res.status(200).json({

            success: true,

            data: result

        });

    }
    catch (error) {

        res.status(404).json({

            success: false,

            message: error.message

        });

    }

};

const getExpenseHistory = async (req, res) => {

    try {

        const result = await expenseService.getExpenseHistory();

        res.status(200).json({

            success: true,

            count: result.length,

            data: result

        });

    }
    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    createExpense,
    getExpenseById,
    getExpenseHistory

};