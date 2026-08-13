const financialSecurityService =
require("../services/financialSecurityService.cjs");

const verifyFinancialPin = async (req, res, next) => {

    try {

        const { financial_pin } = req.body;

        if (!financial_pin) {

            return res.status(400).json({

                success: false,

                message: "Financial PIN is required."

            });

        }

        await financialSecurityService.verifyFinancialPin(

            financial_pin

        );

        next();

    }

    catch (error) {

        res.status(401).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = verifyFinancialPin;