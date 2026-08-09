const connection = require("../config/db");

const getProfitLossSummary = () => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT
                (
                    SELECT COALESCE(SUM(amount),0)
                    FROM income
                ) AS total_income,

                (
                    SELECT COALESCE(SUM(amount),0)
                    FROM expenses
                ) AS total_expense,

                (
                    SELECT COALESCE(SUM(amount),0)
                    FROM cash_book
                    WHERE transaction_type='Cash In'
                ) AS total_cash_in,

                (
                    SELECT COALESCE(SUM(amount),0)
                    FROM cash_book
                    WHERE transaction_type='Cash Out'
                ) AS total_cash_out
        `;

        connection.query(query, (err, result) => {

            if (err) return reject(err);

            resolve(result[0]);

        });

    });

};

const getCashFlowSummary = () => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT

                COALESCE(SUM(
                    CASE
                        WHEN transaction_type='Cash In'
                        AND source='Bill Payment'
                        THEN amount
                    END
                ),0) AS bill_payments,

                COALESCE(SUM(
                    CASE
                        WHEN transaction_type='Cash In'
                        AND source='Advance Payment'
                        THEN amount
                    END
                ),0) AS advance_payments,

                COALESCE(SUM(
                    CASE
                        WHEN transaction_type='Cash In'
                        AND source='Manual'
                        THEN amount
                    END
                ),0) AS manual_income,

                COALESCE(SUM(
                    CASE
                        WHEN transaction_type='Cash Out'
                        AND source='Expense'
                        THEN amount
                    END
                ),0) AS expenses,

                COALESCE(SUM(
                    CASE
                        WHEN transaction_type='Cash Out'
                        AND source='Refund'
                        THEN amount
                    END
                ),0) AS refunds

            FROM cash_book
        `;

        connection.query(query, (err, result) => {

            if (err) return reject(err);

            resolve(result[0]);

        });

    });

};

const getBankAccounts = () => {

    return new Promise((resolve, reject) => {

        connection.query(

            `SELECT * FROM bank_accounts`,

            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result);

            }

        );

    });

};

const getGSTSummary = (fromDate, toDate) => {

    return new Promise((resolve, reject) => {

        let query = `

            SELECT

                g.gst_number,

                g.state,

                COUNT(b.bill_id) AS total_bills,

                COALESCE(
                    SUM(b.subtotal),
                    0
                ) AS taxable_value,

                COALESCE(
                    SUM(b.total_gst),
                    0
                ) AS total_gst,

                COALESCE(
                    SUM(b.grand_total),
                    0
                ) AS total_sales

            FROM gst_details g

            LEFT JOIN bills b

                ON b.bill_status = 'Completed'

                AND b.deleted_at IS NULL

        `;

        const params = [];

        if (fromDate && toDate) {

            query += `
                AND DATE(b.bill_date)
                BETWEEN ? AND ?
            `;

            params.push(fromDate, toDate);

        }

        query += `

            GROUP BY

                g.gst_id,

                g.gst_number,

                g.state

        `;

        connection.query(
            query,
            params,
            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result);

            }
        );

    });

};

const getProfitLoss = (fromDate, toDate) => {

    return new Promise((resolve, reject) => {

        let incomeQuery = `
            SELECT COALESCE(SUM(amount), 0) AS total_income
            FROM income
        `;

        let expenseQuery = `
            SELECT COALESCE(SUM(amount), 0) AS total_expenses
            FROM expenses
        `;

        const incomeParams = [];
        const expenseParams = [];

        if (fromDate && toDate) {

            incomeQuery += `
                WHERE income_date BETWEEN ? AND ?
            `;

            expenseQuery += `
                WHERE expense_date BETWEEN ? AND ?
            `;

            incomeParams.push(fromDate, toDate);
            expenseParams.push(fromDate, toDate);

        }

        connection.query(
            incomeQuery,
            incomeParams,
            (err, incomeResult) => {

                if (err) {
                    return reject(err);
                }

                connection.query(
                    expenseQuery,
                    expenseParams,
                    (err, expenseResult) => {

                        if (err) {
                            return reject(err);
                        }

                        const totalIncome =
                            Number(incomeResult[0].total_income);

                        const totalExpenses =
                            Number(expenseResult[0].total_expenses);

                        resolve({

                            total_income: totalIncome,

                            total_expenses: totalExpenses,

                            gross_profit:
                                totalIncome - totalExpenses

                        });

                    }
                );

            }
        );

    });

};

const getBalanceSheet = (fromDate, toDate) => {

    return new Promise((resolve, reject) => {

        let query = `

            SELECT

                (
                    SELECT
                        COALESCE(SUM(amount), 0)
                    FROM cash_book
                    WHERE transaction_type = 'Cash In'
                `;

        const params = [];

        if (fromDate && toDate) {

            query += `
                AND DATE(transaction_date) BETWEEN ? AND ?
            `;

            params.push(fromDate, toDate);

        }

        query += `

                )

                -

                (

                    SELECT
                        COALESCE(SUM(amount), 0)
                    FROM cash_book
                    WHERE transaction_type = 'Cash Out'
        `;

        if (fromDate && toDate) {

            query += `
                AND DATE(transaction_date) BETWEEN ? AND ?
            `;

            params.push(fromDate, toDate);

        }

        query += `

                ) AS cash,

                (

                    SELECT
                        COALESCE(SUM(current_balance), 0)
                    FROM bank_accounts

                ) AS bank_balance,

                (

                    SELECT
                        COALESCE(SUM(outstanding_balance), 0)
                    FROM customer_ledger_summary

                ) AS receivables,

                (
                    SELECT  
                        COALESCE(SUM(sl.balance), 0)
                    FROM supplier_ledger sl
                    WHERE sl.ledger_id IN (
                        SELECT MAX(sl2.ledger_id)
                        FROM supplier_ledger sl2
                        GROUP BY sl2.supplier_id
                    )
                ) AS payables

        `;

        connection.query(
            query,
            params,
            (err, result) => {

                if (err) {
                    return reject(err);
                }

                const row = result[0];

                const total_assets =
                    Number(row.cash) +
                    Number(row.bank_balance) +
                    Number(row.receivables);

                const total_liabilities =
                    Number(row.payables);

                resolve({

                    cash: Number(row.cash),

                    bank_balance:
                        Number(row.bank_balance),

                    receivables:
                        Number(row.receivables),

                    total_assets,

                    payables:
                        Number(row.payables),

                    total_liabilities,

                    net_worth:
                        total_assets -
                        total_liabilities

                });

            }
        );

    });

};

const getCashFlow = (fromDate, toDate) => {

    return new Promise((resolve, reject) => {

        let query = `

            SELECT

                COALESCE(
                    SUM(
                        CASE
                            WHEN transaction_type = 'Cash In'
                            THEN amount
                            ELSE 0
                        END
                    ),
                    0
                ) AS cash_in,

                COALESCE(
                    SUM(
                        CASE
                            WHEN transaction_type = 'Cash Out'
                            THEN amount
                            ELSE 0
                        END
                    ),
                    0
                ) AS cash_out

            FROM cash_book

        `;

        const params = [];

        if (fromDate && toDate) {

            query += `
                WHERE DATE(transaction_date)
                BETWEEN ? AND ?
            `;

            params.push(fromDate, toDate);

        }

        connection.query(
            query,
            params,
            (err, result) => {

                if (err) {
                    return reject(err);
                }

                const row = result[0];

                const cashIn =
                    Number(row.cash_in);

                const cashOut =
                    Number(row.cash_out);

                resolve({

                    cash_in: cashIn,

                    cash_out: cashOut,

                    net_cash_flow:
                        cashIn - cashOut

                });

            }
        );

    });

};

const getOutstandingPayables = (fromDate, toDate) => {

    return new Promise((resolve, reject) => {

        let query = `
            SELECT
                s.supplier_id,
                s.supplier_name,
                COALESCE(sl.balance, 0) AS outstanding_balance

            FROM suppliers s

            LEFT JOIN supplier_ledger sl

                ON sl.supplier_id = s.supplier_id

                AND sl.ledger_id = (
                    SELECT MAX(sl2.ledger_id)
                    FROM supplier_ledger sl2
                    WHERE sl2.supplier_id = s.supplier_id
        `;

        const params = [];

        /*
         * If a date range is supplied,
         * get the latest ledger entry ON OR BEFORE to_date.
         *
         * We do NOT use MAX(balance).
         * We use the balance from the latest transaction.
         */

        if (toDate) {

            query += `
                    AND DATE(sl2.created_at) <= ?
            `;

            params.push(toDate);

        }

        query += `
                )

            ORDER BY outstanding_balance DESC
        `;

        connection.query(
            query,
            params,
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

    getProfitLossSummary,
    getCashFlowSummary,
    getBankAccounts,
    getGSTSummary,
    getProfitLoss,
    getBalanceSheet,
    getCashFlow,
    getOutstandingPayables

};