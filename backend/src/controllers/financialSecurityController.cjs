const financialSecurityService =
require("../services/financialSecurityService.cjs");

const createFinancialPin = async (req, res) => {

    try {

        const { pin } = req.body;

        await financialSecurityService.createFinancialPin(pin);

        res.status(201).json({

            success: true,

            message: "Financial PIN created successfully."

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

const verifyFinancialPin = async (req, res) => {

    try {

        const { pin } = req.body;

        await financialSecurityService.verifyFinancialPin(pin);

        res.status(200).json({

            success: true,

            message: "PIN verified successfully."

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

const changeFinancialPin = async (req, res) => {

    try {

        const {

            old_pin,

            new_pin

        } = req.body;

        await financialSecurityService.changeFinancialPin(

            old_pin,

            new_pin

        );

        res.status(200).json({

            success: true,

            message: "Financial PIN changed successfully."

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

const getFinancialSecurity = async (req, res) => {

    try {

        const data =
            await financialSecurityService.getFinancialSecurity();

        res.status(200).json({

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

const updateSecuritySettings = async (req, res) => {

    try {

        const {

            max_discount_percent,

            max_rate_change_percent

        } = req.body;

        await financialSecurityService.updateSecuritySettings(

            max_discount_percent,

            max_rate_change_percent

        );

        res.status(200).json({

            success: true,

            message: "Security settings updated successfully."

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

    createFinancialPin,

    verifyFinancialPin,

    changeFinancialPin,

    getFinancialSecurity,

    updateSecuritySettings

};