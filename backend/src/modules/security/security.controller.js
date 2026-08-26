import financialSecurityService from "./security.service.js";
import financialSecurityModel from "./security.model.js";

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

    const userId = req.user?.user_id || null;

    try {

        const { pin } = req.body;

        if (!pin) {

            await financialSecurityModel.createPinLog(
                userId,
                "PIN_VERIFICATION",
                "FAILED"
            );

            return res.status(400).json({

                success: false,

                message: "Financial PIN is required."

            });

        }

        await financialSecurityService.verifyFinancialPin(pin);

        await financialSecurityModel.createPinLog(
            userId,
            "PIN_VERIFICATION",
            "SUCCESS"
        );

        res.status(200).json({

            success: true,

            message: "PIN verified successfully."

        });

    }

    catch (error) {

        await financialSecurityModel.createPinLog(
            userId,
            "PIN_VERIFICATION",
            "FAILED"
        );

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

        const maxDiscount = Number(max_discount_percent);
        const maxRateChange = Number(max_rate_change_percent);

        // Validate discount limit
        if (
            !Number.isFinite(maxDiscount) ||
            maxDiscount < 0 ||
            maxDiscount > 100
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Maximum discount percentage must be between 0 and 100."
            });
        }

        // Validate rate change limit
        if (
            !Number.isFinite(maxRateChange) ||
            maxRateChange < 0 ||
            maxRateChange > 100
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Maximum rate change percentage must be between 0 and 100."
            });
        }

        await financialSecurityService.updateSecuritySettings(
            maxDiscount,
            maxRateChange
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

export {

    createFinancialPin,

    verifyFinancialPin,

    changeFinancialPin,

    getFinancialSecurity,

    updateSecuritySettings

};

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    createFinancialPin,
    verifyFinancialPin,
    changeFinancialPin,
    getFinancialSecurity,
    updateSecuritySettings,
};
