const connection = require("../config/db");

const getBillById = (billId) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT *
            FROM bills
            WHERE bill_id = ?
            AND deleted_at IS NULL
        `;

        connection.query(query, [billId], (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result[0]);

        });

    });

};

const createPayment = (paymentData) => {

    return new Promise((resolve, reject) => {

        const query = `
            INSERT INTO payments
            (
                bill_id,
                total_amount,
                payment_status,
                payment_type,
                created_by
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        connection.query(

            query,

            [
                paymentData.bill_id,
                paymentData.total_amount,
                paymentData.payment_status,
                paymentData.payment_type,
                paymentData.created_by
            ],

            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result);

            }

        );

    });

};

const createPaymentDetails = (paymentId, payments) => {

    return new Promise((resolve, reject) => {

        const query = `
            INSERT INTO payment_details
            (
                payment_id,
                payment_method,
                amount,
                reference_number
            )
            VALUES ?
        `;

        const values = payments.map(payment => [

            paymentId,

            payment.payment_method,

            payment.amount,

            payment.reference_number || null

        ]);

        connection.query(

            query,

            [values],

            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result);

            }

        );

    });

};

const updateBillPaymentStatus = (
    billId,
    paymentStatus
) => {

    return new Promise((resolve, reject) => {

        const query = `
            UPDATE bills
            SET payment_status = ?
            WHERE bill_id = ?
        `;

        connection.query(

            query,

            [paymentStatus, billId],

            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result);

            }

        );

    });

};

const getPendingPayment = (billId) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT
                b.bill_id,
                b.grand_total,
                b.payment_status,
                COALESCE(SUM(p.total_amount), 0) AS paid_amount
            FROM bills b
            LEFT JOIN payments p
                ON b.bill_id = p.bill_id
            WHERE b.bill_id = ?
            GROUP BY
                b.bill_id,
                b.grand_total,
                b.payment_status
        `;

        connection.query(query, [billId], (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result[0]);

        });

    });

};

const getPaidAmountForBill = (billId) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT
                COALESCE(SUM(total_amount), 0) AS paid_amount
            FROM payments
            WHERE bill_id = ?
            AND payment_type = 'Bill Payment'
            AND payment_status IN ('Partial', 'Completed')
        `;

        connection.query(
            query,
            [billId],
            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(Number(result[0].paid_amount));

            }
        );

    });

};

const createAdvancePayment = (paymentData) => {

    return new Promise((resolve, reject) => {

        const paymentQuery = `
            INSERT INTO payments
            (
                bill_id,
                customer_id,
                total_amount,
                payment_status,
                payment_type,
                created_by
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        connection.query(

            paymentQuery,

            [
                null,
                paymentData.customer_id,
                paymentData.total_amount,
                "Completed",
                "Advance",
                paymentData.created_by
            ],

            (err, result) => {

                if (err) {
                    return reject(err);
                }

                const paymentId = result.insertId;

                const detailQuery = `
                    INSERT INTO payment_details
                    (
                        payment_id,
                        payment_method,
                        amount,
                        reference_number
                    )
                    VALUES (?, ?, ?, ?)
                `;

                connection.query(

                    detailQuery,

                    [
                        paymentId,
                        paymentData.payment_method,
                        paymentData.total_amount,
                        paymentData.reference_number || null
                    ],

                    (err) => {

                        if (err) {
                            return reject(err);
                        }

                        resolve({

                            payment_id: paymentId,

                            message:
                                "Advance payment recorded successfully."

                        });

                    }

                );

            }

        );

    });

};

const getCustomerAdvance = (customerId) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT
                p.payment_id,
                p.customer_id,
                p.total_amount,
                p.payment_date,
                pd.payment_method,
                pd.reference_number
            FROM payments p
            LEFT JOIN payment_details pd
                ON p.payment_id = pd.payment_id
            WHERE
                p.customer_id = ?
                AND p.payment_type = 'Advance'
                AND p.is_adjusted = FALSE
                AND p.payment_status = 'Completed'
        `;
        connection.query(query, [customerId], (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result);

        });

    });

};

const adjustAdvancePayment = (paymentId) => {

    return new Promise((resolve, reject) => {

        const query = `
            UPDATE payments
            SET is_adjusted = TRUE
            WHERE payment_id = ?
        `;

        connection.query(query, [paymentId], (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result);

        });

    });

};

const createAdvanceAdjustmentPayment = (paymentData) => {

    return new Promise((resolve, reject) => {

        const query = `
            INSERT INTO payments
            (
                bill_id,
                customer_id,
                total_amount,
                payment_status,
                payment_type,
                created_by
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        connection.query(
            query,
            [
                paymentData.bill_id,
                paymentData.customer_id,
                paymentData.total_amount,
                "Completed",
                "Bill Payment",
                paymentData.created_by
            ],
            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result);

            }
        );

    });

};

const getPaymentById = (paymentId) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT *
            FROM payments
            WHERE payment_id = ?
        `;

        connection.query(query, [paymentId], (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result[0]);

        });

    });

};

const createRefund = (refundData) => {

    return new Promise((resolve, reject) => {

        const query = `
            INSERT INTO refunds
            (
                payment_id,
                refund_amount,
                refund_reason,
                refund_status
            )
            VALUES (?, ?, ?, ?)
        `;

        connection.query(

            query,

            [

                refundData.payment_id,

                refundData.refund_amount,

                refundData.refund_reason,

                "Completed"

            ],

            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result);

            }

        );

    });

};

const updatePaymentStatus = (
    paymentId,
    status
) => {

    return new Promise((resolve, reject) => {

        const query = `
            UPDATE payments
            SET payment_status = ?
            WHERE payment_id = ?
        `;

        connection.query(

            query,

            [status, paymentId],

            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result);

            }

        );

    });

};

const getTotalRefundedAmount = (paymentId) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT
                COALESCE(SUM(refund_amount),0)
                AS refunded_amount
            FROM refunds
            WHERE payment_id = ?
            AND refund_status = 'Completed'
        `;

        connection.query(

            query,

            [paymentId],

            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(
                    Number(result[0].refunded_amount)
                );

            }

        );

    });

};

const getRefundHistory = (filters) => {

    return new Promise((resolve, reject) => {

        let query = `
            SELECT
                r.refund_id,
                r.payment_id,
                p.bill_id,
                p.customer_id,
                r.refund_amount,
                r.refund_reason,
                r.refund_date,
                r.refund_status,
                p.payment_type,
                p.payment_status
            FROM refunds r
            JOIN payments p
                ON r.payment_id = p.payment_id
            WHERE 1=1
        `;

        const values = [];

        if (filters.payment_id) {
            query += " AND r.payment_id = ?";
            values.push(filters.payment_id);
        }

        if (filters.bill_id) {
            query += " AND p.bill_id = ?";
            values.push(filters.bill_id);
        }

        if (filters.customer_id) {
            query += " AND p.customer_id = ?";
            values.push(filters.customer_id);
        }

        query += `
            ORDER BY r.refund_date DESC
        `;

        connection.query(query, values, (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result);

        });

    });

};

const getPaymentHistory = (filters) => {

    return new Promise((resolve, reject) => {

        let query = `
            SELECT
                p.payment_id,
                p.bill_id,
                p.customer_id,
                p.payment_date,
                p.total_amount,
                p.payment_status,
                p.payment_type,

                pd.payment_method,
                pd.amount,
                pd.reference_number,

                b.invoice_number,
                b.grand_total,

                c.first_name,
                c.last_name

            FROM payments p

            LEFT JOIN payment_details pd
                ON p.payment_id = pd.payment_id

            LEFT JOIN bills b
                ON p.bill_id = b.bill_id

            LEFT JOIN customers c
                ON COALESCE(p.customer_id, b.customer_id) = c.customer_id

            WHERE 1=1
        `;

        const values = [];

                if (filters.payment_id) {

            query += " AND p.payment_id = ?";
            values.push(filters.payment_id);

        }

        if (filters.bill_id) {

            query += " AND p.bill_id = ?";
            values.push(filters.bill_id);

        }

        if (filters.customer_id) {

            query += " AND COALESCE(p.customer_id,b.customer_id)=?";
            values.push(filters.customer_id);

        }

        if (filters.payment_status) {

            query += " AND p.payment_status = ?";
            values.push(filters.payment_status);

        }

        if (filters.payment_type) {

            query += " AND p.payment_type = ?";
            values.push(filters.payment_type);

        }

        if (filters.payment_method) {

            query += " AND pd.payment_method = ?";
            values.push(filters.payment_method);

        }

        if (filters.from_date && filters.to_date) {

            query += `
                AND DATE(p.payment_date)
                BETWEEN ? AND ?
            `;

            values.push(
                filters.from_date,
                filters.to_date
            );

        }

        query += `
            ORDER BY p.payment_date DESC,
                     p.payment_id DESC
        `;

                connection.query(

            query,

            values,

            (err, result) => {

                if (err) {

                    return reject(err);

                }

                resolve(result);

            }

        );

    });

};

const getPaymentReceipt = (paymentId) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT

                p.payment_id,
                p.payment_date,
                p.payment_status,
                p.payment_type,
                p.total_amount,

                b.bill_id,
                b.invoice_number,
                b.bill_date,
                b.grand_total,

                c.customer_id,
                c.customer_code,
                c.first_name,
                c.last_name,
                c.mobile,
                c.city,
                c.state,

                pd.payment_method,
                pd.amount,
                pd.reference_number

            FROM payments p

            LEFT JOIN bills b
                ON p.bill_id = b.bill_id

            LEFT JOIN customers c
                ON COALESCE(
                    p.customer_id,
                    b.customer_id
                ) = c.customer_id

            LEFT JOIN payment_details pd
                ON p.payment_id = pd.payment_id

            WHERE p.payment_id = ?

            ORDER BY pd.payment_detail_id;
        `;

        connection.query(

            query,

            [paymentId],

            (err, result) => {

                if (err) {

                    return reject(err);

                }

                resolve(result);

            }

        );

    });

};

module.exports = {

    getBillById,
    createPayment,
    createPaymentDetails,
    updateBillPaymentStatus,
    getPendingPayment,
    getPaidAmountForBill,
    createAdvancePayment,
    getCustomerAdvance,
    adjustAdvancePayment,
    createAdvanceAdjustmentPayment,
    getPaymentById,
    createRefund,
    updatePaymentStatus,
    getTotalRefundedAmount,
    getRefundHistory,
    getPaymentHistory,
    getPaymentReceipt

};