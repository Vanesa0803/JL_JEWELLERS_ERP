const reportService =
require("../services/reportService");

const getSalesReport = async (req, res) => {

    try {

        const data =
        await reportService.getSalesReport(req.query);

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

const getGSTReport = async (req, res) => {

    try {

        const data =
            await reportService.getGSTReport(req.query);

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

const getCustomerReport = async (req,res)=>{

    try{

        const data =
            await reportService.getCustomerReport(req.query);

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

const getLedgerReport = async (req, res) => {

    try {

        const data =
            await reportService.getLedgerReport(req.query);

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

    getSalesReport,

    getGSTReport,

    getCustomerReport,

    getLedgerReport

};