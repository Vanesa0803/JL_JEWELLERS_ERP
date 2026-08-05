const reportService =
require("../services/reportService");
const exportService = require("../services/exportService");

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

const getPaymentReport = async(req,res)=>{

    try{

        const data =
        await reportService.getPaymentReport(req.query);

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

const getInventoryReport = async (req, res) => {

    try {

        console.log("req.query =", req.query);

        const report = await reportService.getInventoryReport(req.query);

        res.status(200).json({

            success: true,
            data: report

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

const exportPDF = async (req, res) => {

    try {

        const filePath =
            await exportService.exportPDF(req.query);

        res.download(filePath);

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

const exportExcel = async (req, res) => {

    try {

        const filePath =
            await exportService.exportExcel(req.query);

        res.download(filePath);

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

const exportCSV = async (req, res) => {

    try {

        const filePath =
            await exportService.exportCSV(req.query);

        res.download(filePath);

    } catch (error) {

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

    getLedgerReport,

    getPaymentReport,

    getInventoryReport,

    exportPDF,

    exportExcel,

    exportCSV

};