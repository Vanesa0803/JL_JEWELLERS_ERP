const incomeService = require("../services/incomeService");

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

    const result = await incomeService.getIncomeHistory();

    res.json({

        success: true,

        count: result.length,

        data: result

    });

};

module.exports = {

    createIncome,
    getIncomeById,
    getIncomeHistory

};