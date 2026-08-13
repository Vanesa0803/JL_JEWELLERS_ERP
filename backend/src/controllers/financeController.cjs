const financeService = require("../services/financeService.cjs");

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

const getBankAccounts = async (req, res) => {

    try {

        const data =
        await financeService.getBankAccounts();

        res.json({

            success: true,
            data

        });

    }

    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};

const getGSTSummary = async (req, res) => {

    try {

        const { from_date, to_date } = req.query;

        const data = await financeService.getGSTSummary(
            from_date,
            to_date
        );

        res.json({
            success: true,
            data
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getProfitLoss = async (req, res) => {

    try {

        const { from_date, to_date } = req.query;

        const data = await financeService.getProfitLoss(
            from_date,
            to_date
        );

        res.json({
            success: true,
            data
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getBalanceSheet = async (req, res) => {

    try {

        const { from_date, to_date } = req.query;

        const data =
            await financeService.getBalanceSheet(
                from_date,
                to_date
            );

        res.json({

            success: true,
            data

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

const getCashFlow = async (req, res) => {

    try {

        const { from_date, to_date } = req.query;

        const data = await financeService.getCashFlow(
            from_date,
            to_date
        );

        res.json({
            success: true,
            data
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getOutstandingPayables = async (req, res) => {

    try {

        const { from_date, to_date } = req.query;

        const data =
            await financeService.getOutstandingPayables(
                from_date,
                to_date
            );

        res.json({

            success: true,
            data

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

const getFinanceDashboard = async (req, res) => {

    try {

        const data =
            await financeService.getFinanceDashboard();

        res.json({

            success: true,

            data

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
    getCashFlowSummary,
    getBankAccounts,
    getGSTSummary,
    getProfitLoss,
    getBalanceSheet,
    getCashFlow,
    getOutstandingPayables,
    getFinanceDashboard

};