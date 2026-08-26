import reportService from "./report.service.js";
import exportService from "./export.service.js";

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

const getFinancialReport = async (req, res) => {

    try {

        const data =
            await reportService.getFinancialReport(
                req.query
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

/*
 * exportPDF / exportExcel / exportCSV used to live here (S2-11).
 *
 * They called exportService.exportPDF, .exportExcel and .exportCSV — none of
 * which exist. The service exports exportToPDF, exportToExcel and exportToCSV.
 * All three therefore returned a 500 on every request and had never worked.
 *
 * They also duplicated the working export surface at
 * /api/v1/export/{pdf,excel,csv}?report=<type>. Removed rather than repaired:
 * two export paths doing the same job drift apart, and nothing could have
 * depended on handlers that only ever returned errors.
 */

export {

    getSalesReport,

    getGSTReport,

    getCustomerReport,

    getLedgerReport,

    getPaymentReport,

    getInventoryReport,

    getFinancialReport

};

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    getSalesReport,
    getGSTReport,
    getCustomerReport,
    getLedgerReport,
    getPaymentReport,
    getInventoryReport,
    getFinancialReport
};
