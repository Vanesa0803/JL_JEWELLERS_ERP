const PDFDocument = require("pdfkit");

const generatePDF = (title, data, res) => {

    const doc = new PDFDocument({
        margin: 40,
        size: "A4"
    });

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename=${title}.pdf`
    );

    doc.pipe(res);

    doc
        .fontSize(20)
        .text(title, {
            align: "center"
        });

    doc.moveDown();

    if (!data.length) {

        doc.text("No Data Found.");

        doc.end();

        return;
    }

    data.forEach((item, index) => {

        doc
            .fontSize(12)
            .text(`${index + 1}.`);

        Object.keys(item).forEach(key => {

            doc.text(`${key} : ${item[key]}`);

        });

        doc.moveDown();

    });

    doc.end();

};

module.exports = generatePDF;