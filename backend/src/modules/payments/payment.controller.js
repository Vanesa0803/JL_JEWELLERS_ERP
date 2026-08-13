import paymentService from "./payment.service.js";

const recordPayment = async (req, res) => {

    try {

        const result = await paymentService.recordPayment(
            req.body
        );

        res.status(201).json({

            success: true,

            data: result

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


const getPendingPayment = async (req, res) => {

    try {

        const result =
            await paymentService.getPendingPayment(
                req.params.bill_id
            );

        res.json({
            success: true,
            data: result
        });

    } catch (error) {

        res.status(404).json({

            success: false,

            message: error.message

        });

    }

};

const createAdvancePayment = async (req, res) => {

    try {

        const result =
            await paymentService.createAdvancePayment(
                req.body
            );

        res.status(201).json({

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

const getCustomerAdvance = async (req, res) => {

    try {

        const advances =
            await paymentService.getCustomerAdvance(
                req.params.customer_id
            );

        res.json({

            success: true,

            count: advances.length,

            data: advances

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

const adjustAdvanceToBill = async (req, res) => {

    try {

        const result =
            await paymentService.adjustAdvanceToBill(
                req.body.bill_id,
                req.body.payment_id
            );

        res.json({

            success: true,

            data: result

        });

    }

    catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

const createRefund = async (req, res) => {

    try {

        const result =
            await paymentService.createRefund(
                req.body
            );

        res.status(201).json({

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

const getRefundHistory = async (req, res) => {

    try {

        const refunds = await paymentService.getRefundHistory(req.query);

        res.json({

            success: true,
            count: refunds.length,
            data: refunds

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,
            message: error.message

        });

    }

};

const getPaymentHistory = async (req, res) => {

    try {

        const history =
            await paymentService.getPaymentHistory(req.query);

        res.json({

            success: true,

            count: history.length,

            data: history

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

const getPaymentReceipt = async (req, res) => {

    try {

        const receipt =
            await paymentService.getPaymentReceipt(
                req.params.payment_id
            );

        res.json({

            success: true,

            data: receipt

        });

    }

    catch (error) {

        res.status(404).json({

            success: false,

            message: error.message

        });

    }

};

export {

    recordPayment,
    getPendingPayment,
    createAdvancePayment,
    getCustomerAdvance,
    adjustAdvanceToBill,
    createRefund,
    getRefundHistory,
    getPaymentHistory,
    getPaymentReceipt

};

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    recordPayment,
    getPendingPayment,
    createAdvancePayment,
    getCustomerAdvance,
    adjustAdvanceToBill,
    createRefund,
    getRefundHistory,
    getPaymentHistory,
    getPaymentReceipt,
};
