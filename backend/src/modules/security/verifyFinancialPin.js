import financialSecurityService from "./security.service.js";
import financialSecurityModel from "./security.model.js";

const verifyFinancialPin = async (req, res, next) => {

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

        await financialSecurityService.verifyFinancialPin(
            pin
        );

        await financialSecurityModel.createPinLog(
            userId,
            "PIN_VERIFICATION",
            "SUCCESS"
        );

        req.financialPinVerified = true;
        req.financialPinUserId = userId;

        next();

    }

    catch (error) {

        await financialSecurityModel.createPinLog(
            userId,
            "PIN_VERIFICATION",
            "FAILED"
        );

        res.status(401).json({

            success: false,

            message: error.message

        });

    }

};

export default verifyFinancialPin;