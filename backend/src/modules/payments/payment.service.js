import paymentModel from "./payment.model.js";
import billModel from "../billing/bill.model.js";
import ledgerService from "../ledger/ledger.service.js";
import cashBookService from "../finance/cashbook.service.js";
import bankLedgerService from "../finance/bankLedger.service.js";
import auditService from "../audit/audit.service.js";
import financialSecurityService from "../security/security.service.js";
import { withTransaction } from "../../utils/withTransaction.js";

const recordPayment = async (paymentData, actorId) => {

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

    // Calculate current payment amount
    const currentPaymentAmount = paymentData.payments.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0
    );

    const grandTotal = Number(bill.grand_total);

    // Get previous successful payments for this bill
    const previousPayments = await paymentModel.getPaidAmountForBill(
        bill.bill_id
    );

    const totalPaid = Number(previousPayments) + currentPaymentAmount;

    let paymentStatus;

    if (totalPaid > grandTotal) {

        throw new Error(
            "Payment amount cannot exceed pending bill amount."
        );

    }
    else if (totalPaid === grandTotal) {

        paymentStatus = "Completed";

    }
    else if (totalPaid > 0) {

        paymentStatus = "Partial";

    }
    else {

        paymentStatus = "Pending";

    }

    for (const payment of paymentData.payments) {

        if (payment.payment_method === "Bank Transfer") {

            if (!payment.bank_account_id) {

                throw new Error(
                    "Bank account is required for Bank Transfer."
                );

            }

        }

    }

    // Create payment record
    const paymentResult = await paymentModel.createPayment({

        bill_id: paymentData.bill_id,

        total_amount: currentPaymentAmount,

        payment_status: paymentStatus,

        payment_type:
            paymentData.payment_type || "Bill Payment",

        created_by:
            actorId

    });

    const paymentId = paymentResult.insertId;

    // Insert payment details
    await paymentModel.createPaymentDetails(

        paymentId,

        paymentData.payments

    );

    for (const payment of paymentData.payments) {

        if (payment.payment_method === "Bank Transfer") {

            await bankLedgerService.createBankLedgerEntry({

                bank_account_id:
                    payment.bank_account_id,

                transaction_type:
                    "Credit",

                amount:
                    payment.amount,

                description:
                    "Bank Transfer Payment - Bill " +
                    bill.bill_id

            });

        }

    }

    const isCash = paymentData.payments.some(
        payment => payment.payment_method === "Cash"
    );

    if (isCash) {

        const cashAmount = paymentData.payments
            .filter(payment => payment.payment_method === "Cash")
            .reduce((sum, payment) => sum + Number(payment.amount), 0);

        await cashBookService.createCashEntry({

            transaction_type: "Cash In",

            source: "Bill Payment",

            reference_id: paymentId,

            customer_id: bill.customer_id,

            amount: cashAmount,

            remarks: "Bill Payment Received",

            created_by: actorId

        });

    }
    
    await ledgerService.createLedgerEntry({

        customer_id: bill.customer_id,

        bill_id: bill.bill_id,

        transaction_type: "Payment",

        debit: 0,

        credit: currentPaymentAmount,

        remarks: "Bill Payment"

    });

    await auditService.createAuditLog({
        userId: actorId,
        tableName: "payments",
        recordId: paymentId,
        action: "PAYMENT",
        oldData: null,
        newData: {
            bill_id: bill.bill_id,
            amount: currentPaymentAmount,
            payment_status: paymentStatus,
            payments: paymentData.payments
        }
    });

    // Update bill payment status
    await billModel.updateBillStatus(
        bill.bill_id,
        bill.bill_status,
        paymentStatus
    );

    return {

        success: true,

        payment_id: paymentId,

        total_amount: currentPaymentAmount,

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
const createAdvancePayment = async (paymentData, actorId) => {

    const allowedMethods = [
        "Cash",
        "Card",
        "UPI",
        "Bank Transfer"
    ];

    if (!allowedMethods.includes(paymentData.payment_method)) {

        throw new Error("Invalid payment method.");

    }

    const result = await paymentModel.createAdvancePayment({

        customer_id: paymentData.customer_id,
        total_amount: paymentData.amount,
        payment_method: paymentData.payment_method,
        reference_number: paymentData.reference_number,
        created_by: actorId

    });

    if (paymentData.payment_method === "Cash") {

        await cashBookService.createCashEntry({

            transaction_type: "Cash In",

            source: "Advance Payment",

            reference_id: result.payment_id,

            customer_id: paymentData.customer_id,

            amount: paymentData.amount,

            remarks: "Advance Payment Received",

            created_by: actorId

        });

    }

    await ledgerService.createLedgerEntry({

        customer_id: paymentData.customer_id,

        bill_id: null,

        transaction_type: "Payment",

        debit: 0,

        credit: paymentData.amount,

        remarks: "Advance Payment"

    });

    await auditService.createAuditLog({
        userId: actorId,
        tableName: "payments",
        recordId: result.payment_id,
        action: "ADVANCE_PAYMENT",
        oldData: null,
        newData: {
            customer_id: paymentData.customer_id,
            amount: Number(paymentData.amount),
            payment_method: paymentData.payment_method,
            reference_number: paymentData.reference_number
        }
    });

    return result;

};

const getCustomerAdvance = async (customerId) => {

    return await paymentModel.getCustomerAdvance(customerId);
};

const adjustAdvanceToBill = async (billId, paymentId, actorId) => {

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

    const previousPaidAmount =
        await paymentModel.getPaidAmountForBill(bill.bill_id);

    const remainingAmount = Number(
        (
            Number(bill.grand_total) -
            Number(previousPaidAmount) -
            Number(advance.total_amount)
        ).toFixed(2)
    );

    if (remainingAmount < 0) {
        throw new Error(
            "Advance amount exceeds the pending bill amount."
        );
    }

    await paymentModel.adjustAdvancePayment(paymentId);

    const adjustmentPayment =
        await paymentModel.createAdvanceAdjustmentPayment({

            bill_id: bill.bill_id,

            customer_id: bill.customer_id,

            total_amount: Number(advance.total_amount),

            created_by: actorId

        });

        await auditService.createAuditLog({
            userId: actorId,
            tableName: "payments",
            recordId: adjustmentPayment.insertId,
            action: "ADVANCE_ADJUSTMENT",
            oldData: {
                advance_payment_id: paymentId,
                advance_amount: Number(advance.total_amount)
            },
            newData: {
                bill_id: bill.bill_id,
                adjusted_amount: Number(advance.total_amount)
            }
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
    await ledgerService.createLedgerEntry({

        customer_id: bill.customer_id,

        bill_id: bill.bill_id,

        transaction_type: "Adjustment",

        debit: 0,

        credit: Number(advance.total_amount),

        remarks: "Advance Adjusted"

    });

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

const createRefund = async (refundData, actorId) => {

    // 1. Financial PIN is mandatory
    if (!refundData.financial_pin) {

        throw new Error(
            "Financial PIN is required for refunds."
        );

    }

    // 2. Verify PIN before opening the transaction
    await financialSecurityService.verifyFinancialPin(
        refundData.financial_pin
    );

    // 3. Get the payment
    const payment =
        await paymentModel.getPaymentById(
            refundData.payment_id
        );

    if (!payment) {

        throw new Error(
            "Payment not found."
        );

    }

    // 4. Only Bill Payments can be refunded
    if (payment.payment_type !== "Bill Payment") {

        throw new Error(
            "Only bill payments can be refunded."
        );

    }

    // 5. Calculate remaining refundable amount
    const alreadyRefunded =
        await paymentModel.getTotalRefundedAmount(
            payment.payment_id
        );

    const remainingRefund =
        Number(payment.total_amount) -
        Number(alreadyRefunded);

    const refundAmount =
        Number(refundData.refund_amount);

    // 6. Validate refund amount
    if (!Number.isFinite(refundAmount) || refundAmount <= 0) {

        throw new Error(
            "Refund amount must be greater than zero."
        );

    }

    if (refundAmount > remainingRefund) {

        throw new Error(
            "Refund amount exceeds remaining refundable balance."
        );

    }

    // 7. Perform ALL financial changes in ONE transaction
    return await withTransaction(
        async (tx, resolve, reject) => {

            try {

                // -------------------------------------------------
                // A. Create refund
                // -------------------------------------------------

                await paymentModel.createRefund(
                    {
                        payment_id: refundData.payment_id,
                        refund_amount: refundAmount,
                        refund_reason: refundData.refund_reason
                    },
                    tx
                );


                // -------------------------------------------------
                // B. Update payment status
                // -------------------------------------------------

                const totalRefundAfterThis =
                    Number(alreadyRefunded) +
                    refundAmount;

                let paymentStatus = "Partial";

                if (
                    totalRefundAfterThis >=
                    Number(payment.total_amount)
                ) {

                    paymentStatus = "Pending";

                }

                await paymentModel.updatePaymentStatus(
                    payment.payment_id,
                    paymentStatus,
                    tx
                );


                // -------------------------------------------------
                // C. Update bill payment status
                // -------------------------------------------------

                if (payment.bill_id) {

                    await paymentModel.updateBillPaymentStatus(
                        payment.bill_id,
                        paymentStatus,
                        tx
                    );

                }


                // -------------------------------------------------
                // D. Customer ledger
                // -------------------------------------------------

                await ledgerService.createLedgerEntry(
                    {
                        customer_id: payment.customer_id,
                        bill_id: payment.bill_id,
                        transaction_type: "Refund",
                        debit: refundAmount,
                        credit: 0,
                        remarks: "Refund Issued"
                    },
                    tx
                );


                // -------------------------------------------------
                // E. Cash book
                // -------------------------------------------------

                await cashBookService.createCashEntry(
                    {
                        transaction_type: "Cash Out",
                        source: "Refund",
                        reference_id: payment.payment_id,
                        customer_id: payment.customer_id,
                        amount: refundAmount,
                        remarks: "Refund Issued",
                        created_by: actorId
                    },
                    tx
                );


                // -------------------------------------------------
                // F. Audit log
                // -------------------------------------------------

                await auditService.createAuditLog(
                    {
                        userId: actorId,
                        tableName: "payments",
                        recordId: refundData.payment_id,
                        action: "REFUND",

                        oldData: {
                            payment_id: refundData.payment_id,
                            refund_amount: Number(alreadyRefunded)
                        },

                        newData: {
                            payment_id: refundData.payment_id,
                            refund_amount: refundAmount,
                            refund_reason:
                                refundData.refund_reason
                        }
                    },
                    tx
                );


                // -------------------------------------------------
                // G. Commit everything
                // -------------------------------------------------

                tx.commit((commitError) => {

                    if (commitError) {

                        return tx.rollback(() => {
                            reject(commitError);
                        });

                    }

                    resolve({

                        payment_id:
                            payment.payment_id,

                        refunded_amount:
                            refundAmount,

                        payment_status:
                            paymentStatus,

                        message:
                            "Refund processed successfully."

                    });

                });

            }

            catch (error) {

                tx.rollback(() => {
                    reject(error);
                });

            }

        }
    );

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
