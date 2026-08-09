const cashBookService = require("../services/cashBookService");

const getCashBookStatement = async (req, res) => {

    try {

        const result =
            await cashBookService.getCashBookStatement();

        res.status(200).json({

            success: true,

            data: result

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    getCashBookStatement

};