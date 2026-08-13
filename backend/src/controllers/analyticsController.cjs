const analyticsService =
require("../services/analyticsService.cjs");

const getSalesTarget = async (req, res) => {

    try {

        const data =
            await analyticsService.getSalesTarget();

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

const getMonthlyRevenue = async (req, res) => {

    try {

        const data =
            await analyticsService.getMonthlyRevenue();

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

const getYearlyRevenue = async (req, res) => {

    try {

        const data =
            await analyticsService.getYearlyRevenue();

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

const getRevenueComparison = async (req,res)=>{

    try{

        const data =
            await analyticsService.getRevenueComparison();

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

const getProfitTrends = async (req, res) => {

    try {

        const data =
            await analyticsService.getProfitTrends();

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

const getCustomerAnalytics = async (req, res) => {

    try{

        const data =
            await analyticsService.getCustomerAnalytics();

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

const getInventoryAnalytics = async (req, res) => {

    try {

        const data =
            await analyticsService.getInventoryAnalytics();

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

const getFinancialAnalytics = async (req, res) => {

    try {

        const data =
            await analyticsService.getFinancialAnalytics();

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

    getSalesTarget,
    getMonthlyRevenue,
    getYearlyRevenue,
    getRevenueComparison,
    getProfitTrends,
    getCustomerAnalytics,
    getInventoryAnalytics,
    getFinancialAnalytics

};