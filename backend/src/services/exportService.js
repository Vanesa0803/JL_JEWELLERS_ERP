const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const { Parser } = require("json2csv");

const exportToPDF = (title, data) => {

    return new Promise((resolve) => {

        const doc = new PDFDocument();

        const chunks = [];

        doc.on("data", (chunk) => {

            chunks.push(chunk);

        });

        doc.on("end", () => {

            resolve(Buffer.concat(chunks));

        });

        doc.fontSize(20).text(title);

        doc.moveDown();

        if (!data.length) {

            doc.text("No Data Found");

        } else {

            data.forEach((row) => {

                Object.entries(row).forEach(([key, value]) => {

                    doc.text(`${key} : ${value}`);

                });

                doc.moveDown();

            });

        }

        doc.end();

    });

};

const exportToExcel = async (sheetName, data) => {

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet(sheetName);

    if (data.length > 0) {

        worksheet.columns = Object.keys(data[0]).map((key) => ({

            header: key,

            key: key,

            width: 25

        }));

        worksheet.addRows(data);

    }

    return workbook.xlsx.writeBuffer();

};

const exportToCSV = (data) => {

    if (!data.length) {

        return "";

    }

    const parser = new Parser();

    return parser.parse(data);

};

module.exports = {

    exportToPDF,

    exportToExcel,

    exportToCSV

};