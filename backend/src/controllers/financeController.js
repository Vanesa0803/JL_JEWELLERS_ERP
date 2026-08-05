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

        const data =
            await financeService.getGSTSummary();

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

const getProfitLoss = async (req,res)=>{

    try{

        const data =
        await financeService.getProfitLoss();

        res.json({

            success:true,

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

const getBalanceSheet = async (req, res) => {

    try {

        const data =
            await financeService.getBalanceSheet();

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

const getCashFlow = async (req,res)=>{

    try{

        const data =
        await financeService.getCashFlow();

        res.json({

            success:true,

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

const getOutstandingPayables = async (req,res)=>{

    try{

        const data =
        await financeService.getOutstandingPayables();

        res.json({

            success:true,

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