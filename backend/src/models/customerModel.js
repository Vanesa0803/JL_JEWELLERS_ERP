const connection = require("../config/db");

const getCustomerAccountSummary = (customerId) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT

                c.customer_id,

                CONCAT(c.first_name,' ',c.last_name)
                AS customer_name,

                c.mobile,

                COALESCE(
                    SUM(DISTINCT b.grand_total),
                    0
                ) AS total_bills,

                (
                    SELECT
                        COALESCE(SUM(total_amount),0)
                    FROM payments
                    WHERE customer_id = c.customer_id
                    AND payment_type = 'Bill Payment'
                ) AS total_paid,

                (
                    SELECT
                        COALESCE(SUM(total_amount),0)
                    FROM payments
                    WHERE customer_id = c.customer_id
                    AND payment_type = 'Advance'
                    AND payment_status = 'Completed'
                ) AS advance_balance,

                (
                    SELECT
                        COALESCE(SUM(r.refund_amount),0)
                    FROM refunds r
                    INNER JOIN payments p
                        ON r.payment_id = p.payment_id
                    WHERE p.customer_id = c.customer_id
                ) AS refunds,

                (
                    SELECT
                        MAX(created_at)
                    FROM customer_ledger
                    WHERE customer_id = c.customer_id
                ) AS last_transaction

            FROM customers c

            LEFT JOIN bills b
                ON c.customer_id = b.customer_id

            WHERE c.customer_id = ?

            GROUP BY
                c.customer_id,
                c.first_name,
                c.last_name,
                c.mobile
        `;

        connection.query(query, [customerId], (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result[0]);

        });

    });

};

module.exports = {

    getCustomerAccountSummary

};