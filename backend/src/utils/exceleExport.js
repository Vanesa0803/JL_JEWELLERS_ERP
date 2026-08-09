const ExcelJS = require("exceljs");

const generateExcel = async (sheetName, data, res) => {

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet(sheetName);

    if (data.length > 0) {

        worksheet.columns = Object.keys(data[0]).map(key => ({
            header: key,
            key: key,
            width: 20
        }));

        worksheet.addRows(data);

    }

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename=${sheetName}.xlsx`
    );

    await workbook.xlsx.write(res);

    res.end();

};

module.exports = generateExcel;