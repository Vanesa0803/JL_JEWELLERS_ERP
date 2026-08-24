import securityService from "./security.service.js";

/* ------------------------------------------------------------------ */
/* Helper                                                             */
/* ------------------------------------------------------------------ */

const resolveUserId = (req) => {
    return (
        req.user?.user_id ??
        req.user?.id ??
        req.body?.user_id
    );
};

/* ------------------------------------------------------------------ */
/* CREATE PIN                                                         */
/* ------------------------------------------------------------------ */

const createFinancialPin = async (
    req,
    res
) => {
    try {
        const userId =
            resolveUserId(req);

        const { pin } = req.body;

        await securityService.createFinancialPin(
            userId,
            pin
        );

        return res.status(201).json({
            success: true,
            statusCode: 201,
            message:
                "Financial PIN created successfully"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: error.message
        });
    }
};

/* ------------------------------------------------------------------ */
/* VERIFY PIN                                                         */
/* ------------------------------------------------------------------ */

const verifyFinancialPin = async (
    req,
    res
) => {
    try {
        const userId =
            resolveUserId(req);

        const { pin } = req.body;

        await securityService.verifyFinancialPin(
            userId,
            pin
        );

        return res.status(200).json({
            success: true,
            statusCode: 200,
            message:
                "PIN verified successfully"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: error.message
        });
    }
};

/* ------------------------------------------------------------------ */
/* CHANGE PIN                                                         */
/* ------------------------------------------------------------------ */

const changeFinancialPin = async (
    req,
    res
) => {
    try {
        const userId =
            resolveUserId(req);

        const {
            old_pin,
            new_pin
        } = req.body;

        await securityService.changeFinancialPin(
            userId,
            old_pin,
            new_pin
        );

        return res.status(200).json({
            success: true,
            statusCode: 200,
            message:
                "Financial PIN changed successfully"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: error.message
        });
    }
};

/* ------------------------------------------------------------------ */
/* GET SECURITY                                                        */
/* ------------------------------------------------------------------ */

const getFinancialSecurity = async (
    req,
    res
) => {
    try {
        const userId =
            resolveUserId(req);

        const data =
            await securityService.getFinancialSecurity(
                userId
            );

        return res.status(200).json({
            success: true,
            statusCode: 200,
            data,
            message:
                "Financial security retrieved successfully"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: error.message
        });
    }
};

/* ------------------------------------------------------------------ */
/* UPDATE SECURITY SETTINGS                                           */
/* ------------------------------------------------------------------ */

const updateSecuritySettings = async (
    req,
    res
) => {
    try {
        const {
            max_failed_attempts,
            lock_minutes
        } = req.body;

        const data =
            await securityService.updateSecuritySettings(
                max_failed_attempts,
                lock_minutes
            );

        return res.status(200).json({
            success: true,
            statusCode: 200,
            data,
            message:
                "Security settings updated successfully"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
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

export default {
    createFinancialPin,
    verifyFinancialPin,
    changeFinancialPin,
    getFinancialSecurity,
    updateSecuritySettings
};