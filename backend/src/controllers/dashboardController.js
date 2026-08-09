const dashboardService = require("../services/dashboardService");

const getDashboardSummary = async (req, res) => {

    try {

        const data =
            await dashboardService.getDashboardSummary();

        res.json({
            success: true,
            data
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getSalesAnalytics = async (req, res) => {

    try {

        const { from_date, to_date } = req.query;

        const data =
            await dashboardService.getSalesAnalytics(
                from_date,
                to_date
            );

        res.json({

            success: true,

            data

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getInventoryDashboard = async (req, res) => {

    try {

        const data =
            await dashboardService.getInventoryDashboard();

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

const getStockMovement = async (req,res)=>{

    try{

        const data =
            await dashboardService.getStockMovement();

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

    getDashboardSummary,
    getSalesAnalytics,
    getInventoryDashboard,
    getStockMovement

};