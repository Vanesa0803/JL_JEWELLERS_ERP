const paymentModel = require("../models/paymentModel");
const billModel = require("../models/billModel");

const recordPayment = async (paymentData) => {

    // Check whether bill exists
    const bill = await paymentModel.getBillById(
        paymentData.bill_id
    );

    if (!bill) {
        throw new Error("Bill not found.");
    }

    const allowedMethods = [
        "Cash",
        "Card",
        "UPI",
        "Bank Transfer"
    ];

    for (const payment of paymentData.payments) {

        if (!allowedMethods.includes(payment.payment_method)) {

            throw new Error(
                `Invalid payment method: ${payment.payment_method}`
            );

        }

    }

    const usedMethods = new Set();

    for (const payment of paymentData.payments) {

        if (usedMethods.has(payment.payment_method)) {

            throw new Error(
                `Duplicate payment method: ${payment.payment_method}`
            );

        }

        usedMethods.add(payment.payment_method);

    }

    // Calculate total payment
    const totalAmount = paymentData.payments.reduce(

        (sum, payment) => sum + Number(payment.amount),

        0

    );
    const grandTotal = Number(bill.grand_total);

    let paymentStatus;

    if (totalAmount === grandTotal) {

        paymentStatus = "Completed";

    }
    else if (totalAmount > 0 && totalAmount < grandTotal) {

        paymentStatus = "Partial";

    }
    else if (totalAmount === 0) {

        paymentStatus = "Pending";

    }
    else {

        throw new Error(
            "Payment amount cannot exceed bill amount."
        );

    }

    // Create payment record
    const paymentResult = await paymentModel.createPayment({

        bill_id: paymentData.bill_id,

        total_amount: totalAmount,

        payment_status: paymentStatus,

        payment_type:
            paymentData.payment_type || "Bill Payment",

        created_by:
            paymentData.created_by || null

    });

    const paymentId = paymentResult.insertId;

    // Insert payment details
    await paymentModel.createPaymentDetails(

        paymentId,

        paymentData.payments

    );

    // Update bill payment status
    await billModel.updateBillStatus(
        bill.bill_id,
        bill.bill_status,
        paymentStatus
    );

    return {

        success: true,

        payment_id: paymentId,

        total_amount: totalAmount,

        message: "Payment recorded successfully."

    };

};

const getPendingPayment = async (billId) => {

    const bill = await paymentModel.getPendingPayment(billId);

    if (!bill) {
        throw new Error("Bill not found.");
    }

    const pendingAmount = Number(
        (
            Number(bill.grand_total) -
            Number(bill.paid_amount)
        ).toFixed(2)
    );

    return {

        bill_id: bill.bill_id,

        grand_total: Number(bill.grand_total),

        paid_amount: Number(bill.paid_amount),

        pending_amount: pendingAmount,

        payment_status: bill.payment_status

    };

};
const createAdvancePayment = async (paymentData) => {

    const allowedMethods = [
        "Cash",
        "Card",
        "UPI",
        "Bank Transfer"
    ];

    if (!allowedMethods.includes(paymentData.payment_method)) {

        throw new Error("Invalid payment method.");

    }

    return await paymentModel.createAdvancePayment({

        customer_id: paymentData.customer_id,

        total_amount: paymentData.amount,

        payment_method: paymentData.payment_method,

        reference_number:
            paymentData.reference_number,

        created_by:
            paymentData.created_by

    });

};

const getCustomerAdvance = async (customerId) => {

    return await paymentModel.getCustomerAdvance(customerId);

    const advances = await paymentModel.getCustomerAdvance(
        bill.customer_id
    );

    console.log("Bill Customer:", bill.customer_id);
    console.log("Advances:", advances);
    console.log("Payment ID received:", paymentId);

};

const adjustAdvanceToBill = async (billId, paymentId) => {

    const bill = await paymentModel.getBillById(billId);

    if (!bill) {
        throw new Error("Bill not found.");
    }

    const advances = await paymentModel.getCustomerAdvance(
        bill.customer_id
    );

    const advance = advances.find(
        a => a.payment_id == paymentId
    );

    if (!advance) {
        throw new Error("Advance payment not found.");
    }

    const remainingAmount = Number(
        (
            Number(bill.grand_total) -
            Number(advance.total_amount)
        ).toFixed(2)
    );

    await paymentModel.adjustAdvancePayment(paymentId);

    const adjustmentPayment =
        await paymentModel.createAdvanceAdjustmentPayment({

            bill_id: bill.bill_id,

            customer_id: bill.customer_id,

            total_amount: Number(advance.total_amount),

            created_by: 1

        });

    await paymentModel.createPaymentDetails(

        adjustmentPayment.insertId,
        [

            {

                payment_method: "Cash",

                amount: Number(advance.total_amount),

                reference_number: "ADV-" + paymentId

            }

        ]

    );
    
    let paymentStatus = "Partial";

    if (remainingAmount === 0) {

        paymentStatus = "Completed";

    }

    await paymentModel.updateBillPaymentStatus(

        bill.bill_id,

        paymentStatus

    );

    return {

        bill_id: bill.bill_id,

        grand_total: Number(bill.grand_total),

        advance_used: Number(advance.total_amount),

        remaining_amount: remainingAmount,

        message: "Advance adjusted successfully."

    };

};

const createRefund = async (refundData) => {

    const payment =
        await paymentModel.getPaymentById(
            refundData.payment_id
        );
    const alreadyRefunded =
        await paymentModel.getTotalRefundedAmount(
            payment.payment_id
        );

    const remainingRefund =
        Number(payment.total_amount)

        -

        alreadyRefunded;    

    if (!payment) {

        throw new Error("Payment not found.");

    }

    if (payment.payment_type !== "Bill Payment") {

        throw new Error(
            "Only bill payments can be refunded."
        );

    }

    if (
        Number(refundData.refund_amount)
        >
        Number(remainingRefund)
    ) {

        throw new Error(
            "Refund amount exceeds remaining refundable balance."
        );

    }

    await paymentModel.createRefund({

        payment_id: refundData.payment_id,

        refund_amount: refundData.refund_amount,

        refund_reason: refundData.refund_reason

    });

    const totalRefundAfterThis =

        alreadyRefunded

        +

        Number(refundData.refund_amount);

    let paymentStatus = "Partial";

    if (
        totalRefundAfterThis >=
        Number(payment.total_amount)
    )
    {
        paymentStatus = "Pending";
    }{

        paymentStatus = "Pending";

    }

    await paymentModel.updatePaymentStatus(

        payment.payment_id,

        paymentStatus

    );

    if (payment.bill_id) {

        await paymentModel.updateBillPaymentStatus(

            payment.bill_id,

            paymentStatus

        );

    }

    return {

        payment_id: payment.payment_id,

        refunded_amount: Number(
            refundData.refund_amount
        ),

        payment_status: paymentStatus,

        message: "Refund processed successfully."

    };

};

const getRefundHistory = async (filters) => {

    return await paymentModel.getRefundHistory(filters);

};

const getPaymentHistory = async (filters) => {

    return await paymentModel.getPaymentHistory(filters);

};

const getPaymentReceipt = async (paymentId) => {

    const receipt =
        await paymentModel.getPaymentReceipt(paymentId);

    if (!receipt.length) {

        throw new Error("Payment not found.");

    }

    return receipt;

};

module.exports = {

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