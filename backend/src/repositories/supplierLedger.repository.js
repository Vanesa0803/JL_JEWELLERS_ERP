import { pool } from '../config/db.js';

class SupplierLedgerRepository {
    async getOutstandingBalance(supplierId) {
        // Outstanding = Opening Balance + (Purchases) - (Payments + Returns)
        const query = `
            SELECT 
                (SELECT COALESCE(opening_balance, 0) FROM suppliers WHERE supplier_id = ?) 
                + 
                (SELECT COALESCE(SUM(total_amount), 0) FROM purchase_orders WHERE supplier_id = ? AND order_status NOT IN ('Draft', 'Cancelled'))
                - 
                (SELECT COALESCE(SUM(amount), 0) FROM supplier_payments WHERE supplier_id = ?)
                - 
                (SELECT COALESCE(SUM(total_amount), 0) FROM purchase_returns WHERE supplier_id = ?) AS outstanding_balance
        `;
        const [rows] = await pool.execute(query, [supplierId, supplierId, supplierId, supplierId]);
        return rows[0].outstanding_balance;
    }

    async getLedgerTransactions(supplierId) {
        // Compile a unified chronological ledger using UNION ALL
        // Credit = Payable to supplier increases
        // Debit = Payable to supplier decreases
        
        const query = `
            SELECT 
                'Opening Balance' AS transaction_type,
                NULL AS reference_id,
                NULL AS reference_no,
                created_at AS transaction_date,
                opening_balance AS credit,
                0 AS debit,
                'Initial Setup' AS remarks
            FROM suppliers 
            WHERE supplier_id = ?

            UNION ALL

            SELECT 
                'Purchase Order' AS transaction_type,
                purchase_order_id AS reference_id,
                purchase_order_number AS reference_no,
                order_date AS transaction_date,
                total_amount AS credit,
                0 AS debit,
                remarks
            FROM purchase_orders 
            WHERE supplier_id = ? AND order_status NOT IN ('Draft', 'Cancelled')

            UNION ALL

            SELECT 
                'Payment' AS transaction_type,
                supplier_payment_id AS reference_id,
                payment_reference AS reference_no,
                payment_date AS transaction_date,
                0 AS credit,
                amount AS debit,
                remarks
            FROM supplier_payments 
            WHERE supplier_id = ?

            UNION ALL

            SELECT 
                'Purchase Return' AS transaction_type,
                purchase_return_id AS reference_id,
                return_number AS reference_no,
                return_date AS transaction_date,
                0 AS credit,
                total_amount AS debit,
                reason AS remarks
            FROM purchase_returns 
            WHERE supplier_id = ?

            ORDER BY transaction_date ASC
        `;
        const [rows] = await pool.execute(query, [supplierId, supplierId, supplierId, supplierId]);
        
        // Calculate running balance in code or SQL (easier in JS)
        let runningBalance = 0;
        const ledger = rows.map(row => {
            runningBalance += Number(row.credit) - Number(row.debit);
            return {
                ...row,
                credit: Number(row.credit),
                debit: Number(row.debit),
                balance: runningBalance
            };
        });

        return ledger;
    }
}

export default new SupplierLedgerRepository();
