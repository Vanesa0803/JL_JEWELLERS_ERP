const { Parser } = require("json2csv");

const generateCSV = (fileName, data, res) => {

    const parser = new Parser();

    const csv = parser.parse(data);

    res.header(
        "Content-Type",
        "text/csv"
    );

    res.attachment(`${fileName}.csv`);

    res.send(csv);

};

module.exports = generateCSV;