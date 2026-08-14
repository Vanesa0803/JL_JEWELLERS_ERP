import expenseService from "./expense.service.js";

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

        const { from_date, to_date } = req.query;

        const result =
            await expenseService.getExpenseHistory(
                from_date,
                to_date
            );

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

export {

    createExpense,
    getExpenseById,
    getExpenseHistory

};

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    createExpense,
    getExpenseById,
    getExpenseHistory,
};
