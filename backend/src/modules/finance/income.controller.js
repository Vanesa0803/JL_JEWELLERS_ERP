import incomeService from "./income.service.js";

const createIncome = async (req, res) => {

    try {

        const result = await incomeService.createIncome(req.body);

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

const getIncomeById = async (req, res) => {

    try {

        const result = await incomeService.getIncomeById(req.params.income_id);

        res.json({

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

const getIncomeHistory = async (req, res) => {

    try {

        const { from_date, to_date } = req.query;

        const result =
            await incomeService.getIncomeHistory(
                from_date,
                to_date
            );

        res.json({

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

    createIncome,
    getIncomeById,
    getIncomeHistory

};

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    createIncome,
    getIncomeById,
    getIncomeHistory,
};
