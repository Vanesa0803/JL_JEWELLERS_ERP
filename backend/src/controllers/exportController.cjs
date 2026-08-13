const reportService = require("../services/reportService.cjs");
const exportService = require("../services/exportService.cjs");

const exportPDF = async (req, res) => {

    try {

        const reportType = req.query.report;

        let data = [];

        switch (reportType) {

            case "sales":
                data = await reportService.getSalesReport(req.query);
                break;

            case "gst":
                data = await reportService.getGSTReport(req.query);
                break;

            case "customer":
                data = await reportService.getCustomerReport(req.query);
                break;

            case "ledger":
                data = await reportService.getLedgerReport(req.query);
                break;

            case "payment":
                data = await reportService.getPaymentReport(req.query);
                break;

            case "inventory":
                data = await reportService.getInventoryReport(req.query);
                break;

            default:

                return res.status(400).json({

                    success: false,
                    message: "Invalid report type"

                });

        }

        const reportTitle =
            reportType.charAt(0).toUpperCase() +
            reportType.slice(1) +
            " Report";

        const pdfBuffer =
            await exportService.exportToPDF(reportTitle, data);

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${reportType}.pdf`
        );

        res.send(pdfBuffer);

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

const exportExcel = async (req, res) => {

    try {

        const reportType = req.query.report;

        let data = [];

        switch (reportType) {

            case "sales":
                data = await reportService.getSalesReport(req.query);
                break;

            case "gst":
                data = await reportService.getGSTReport(req.query);
                break;

            case "customer":
                data = await reportService.getCustomerReport(req.query);
                break;

            case "ledger":
                data = await reportService.getLedgerReport(req.query);
                break;

            case "payment":
                data = await reportService.getPaymentReport(req.query);
                break;

            case "inventory":
                data = await reportService.getInventoryReport(req.query);
                break;

            default:

                return res.status(400).json({

                    success: false,
                    message: "Invalid report type"

                });

        }

        const reportTitle =
            reportType.charAt(0).toUpperCase() +
            reportType.slice(1) +
            " Report";

        const excelBuffer =
            await exportService.exportToExcel(reportTitle, data);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${reportType}.xlsx`
        );

        res.send(excelBuffer);

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

const exportCSV = async (req, res) => {

    try {

        const reportType = req.query.report;

        let data = [];

        switch (reportType) {

            case "sales":
                data = await reportService.getSalesReport(req.query);
                break;

            case "gst":
                data = await reportService.getGSTReport(req.query);
                break;

            case "customer":
                data = await reportService.getCustomerReport(req.query);
                break;

            case "ledger":
                data = await reportService.getLedgerReport(req.query);
                break;

            case "payment":
                data = await reportService.getPaymentReport(req.query);
                break;

            case "inventory":
                data = await reportService.getInventoryReport(req.query);
                break;

            default:

                return res.status(400).json({

                    success: false,
                    message: "Invalid report type"

                });

        }

        const csv =
            exportService.exportToCSV(data);

        res.setHeader(
            "Content-Type",
            "text/csv"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${reportType}.csv`
        );

        res.send(csv);

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

module.exports = {

    exportPDF,
    exportExcel,
    exportCSV

};