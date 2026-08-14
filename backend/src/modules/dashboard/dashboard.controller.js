import dashboardService from "./dashboard.service.js";

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

export {

    getDashboardSummary,
    getSalesAnalytics,
    getInventoryDashboard,
    getStockMovement

};

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    getDashboardSummary,
    getSalesAnalytics,
    getInventoryDashboard,
    getStockMovement,
};
