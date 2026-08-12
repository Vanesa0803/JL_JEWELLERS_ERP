import { pool } from '../config/db.js';

class CustomerLedgerRepository {
    async getOutstandingBalance(customerId) {
        // Since there is no dedicated customer_ledger or customer_payments table yet,
        // we derive the outstanding balance from the customer_orders table.
        const query = `
            SELECT COALESCE(SUM(balance_amount), 0) AS total_outstanding
            FROM customer_orders
            WHERE customer_id = ? AND order_status NOT IN ('Cancelled')
        `;
        const [rows] = await pool.execute(query, [customerId]);
        return rows[0].total_outstanding;
    }

    async getLedgerTransactions(customerId) {
        // Without a payments/ledger table, we can only list the orders as debit transactions.
        // Once the finance module is complete, this query should UNION with customer_payments.
        const query = `
            SELECT 
                customer_order_id AS transaction_ref,
                order_number AS document_no,
                order_date AS transaction_date,
                'Order' AS transaction_type,
                total_amount AS debit,
                advance_amount AS credit,
                balance_amount AS balance,
                remarks
            FROM customer_orders
            WHERE customer_id = ? AND order_status NOT IN ('Cancelled')
            ORDER BY order_date DESC
        `;
        const [rows] = await pool.execute(query, [customerId]);
        return rows;
    }
}

export default new CustomerLedgerRepository();
