import billingService from "../billing/bill.service.js";
import financialSecurityService from "./security.service.js";
import financialSecurityModel from "./security.model.js";

const requireFinancialPinForCompletedBill = async (
    req,
    res,
    next
) => {
    const userId = req.user?.user_id || null;

    try {

        const billId = req.params.id;

        // 1. Get bill
        const bill = await billingService.getBillById(billId);

        // 2. Bill doesn't exist
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: "Bill not found."
            });
        }

        // 3. Draft bills do not require Financial PIN
        if (bill.bill.bill_status !== "Completed") {
            return next();
        }

        // 4. Completed bill requires Financial PIN
        const { pin } = req.body;

        if (!pin) {

            await financialSecurityModel.createPinLog(
                userId,
                "COMPLETED_BILL_EDIT",
                "FAILED"
            );

            return res.status(400).json({
                success: false,
                message:
                    "Financial PIN is required to edit a completed bill."
            });
        }

        // 5. Verify Financial PIN
        await financialSecurityService.verifyFinancialPin(
            pin
        );

        // 6. Record successful PIN verification
        await financialSecurityModel.createPinLog(
            userId,
            "COMPLETED_BILL_EDIT",
            "SUCCESS"
        );

        // 7. Mark PIN as verified for downstream handlers
        req.financialPinVerified = true;
        req.financialPinUserId = userId;

        next();

    } catch (error) {

        try {
            await financialSecurityModel.createPinLog(
                userId,
                "COMPLETED_BILL_EDIT",
                "FAILED"
            );
        } catch (logError) {
            console.error(
                "PIN LOG ERROR:",
                logError
            );
        }

        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

export default requireFinancialPinForCompletedBill;