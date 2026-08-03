const financeService = require("../services/financeService");

const getProfitLossSummary = async (req, res) => {

    try {

        const result =
            await financeService.getProfitLossSummary();

        res.status(200).json({

            success: true,

            data: result

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getCashFlowSummary = async (req, res) => {

    try {

        const result =
            await financeService.getCashFlowSummary();

        res.status(200).json({

            success: true,

            data: result

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    getProfitLossSummary,
    getCashFlowSummary

};