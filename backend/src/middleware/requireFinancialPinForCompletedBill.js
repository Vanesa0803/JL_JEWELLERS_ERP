const billingService =
require("../services/billingService");

const financialSecurityService =
require("../services/financialSecurityService");


const requireFinancialPinForCompletedBill = async (
    req,
    res,
    next
) => {

    try {

        const billId = req.params.id;


        // 1. Get Bill

        const bill =
            await billingService.getBillById(billId);


        // 2. Bill doesn't exist

        if (!bill) {

            return res.status(404).json({

                success: false,

                message: "Bill not found."

            });

        }


        // 3. Draft bills don't require PIN

        if (bill.bill.bill_status !== "Completed") {

            return next();

        }


        // 4. Completed bill requires PIN

        const { financial_pin } = req.body;


        if (!financial_pin) {

            return res.status(400).json({

                success: false,

                message:
                    "Financial PIN is required to edit a completed bill."

            });

        }


        // 5. Verify PIN

        await financialSecurityService.verifyFinancialPin(

            financial_pin

        );


        // 6. PIN valid

        next();

    }

    catch (error) {

        return res.status(401).json({

            success: false,

            message: error.message

        });

    }

};


module.exports =
    requireFinancialPinForCompletedBill;