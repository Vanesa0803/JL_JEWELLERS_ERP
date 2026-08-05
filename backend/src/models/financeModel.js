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

const getGSTSummary = () => {

    return new Promise((resolve, reject) => {

        const query = `

            SELECT

                g.gst_number,

                g.state,

                COUNT(b.bill_id) AS total_bills,

                COALESCE(SUM(b.subtotal),0) AS taxable_value,

                COALESCE(SUM(b.total_gst),0) AS total_gst,

                COALESCE(SUM(b.grand_total),0) AS total_sales

            FROM gst_details g

            LEFT JOIN bills b
            ON b.bill_status = 'Completed'
            AND b.deleted_at IS NULL

            GROUP BY
                g.gst_id,
                g.gst_number,
                g.state

        `;

        connection.query(query, (err, result) => {

            if (err) return reject(err);

            resolve(result);

        });

    });

};

const getProfitLoss = () => {

    return new Promise((resolve, reject) => {

        const query = `

            SELECT

                (
                    SELECT
                    COALESCE(SUM(amount),0)
                    FROM income
                ) AS total_income,

                (
                    SELECT
                    COALESCE(SUM(amount),0)
                    FROM expenses
                ) AS total_expenses,

                (
                    (
                        SELECT COALESCE(SUM(amount),0)
                        FROM income
                    )
                    -
                    (
                        SELECT COALESCE(SUM(amount),0)
                        FROM expenses
                    )
                ) AS gross_profit

        `;

        connection.query(query,(err,result)=>{

            if(err){

                return reject(err);

            }

            resolve(result[0]);

        });

    });

};

const getBalanceSheet = () => {

    return new Promise((resolve, reject) => {

        const query = `

            SELECT

                (
                    SELECT
                    COALESCE(SUM(amount),0)
                    FROM cash_book
                    WHERE transaction_type = 'Cash In'
                )

                -

                (

                    SELECT
                    COALESCE(SUM(amount),0)
                    FROM cash_book
                    WHERE transaction_type = 'Cash Out'

                ) AS cash,

                (

                    SELECT
                    COALESCE(SUM(current_balance),0)
                    FROM bank_accounts

                ) AS bank_balance,

                (

                    SELECT
                    COALESCE(SUM(outstanding_balance),0)
                    FROM customer_ledger_summary

                ) AS receivables,

                (

                    SELECT
                    COALESCE(SUM(balance),0)
                    FROM supplier_ledger

                ) AS payables

        `;

        connection.query(query, (err, result) => {

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

                cash: row.cash,

                bank_balance: row.bank_balance,

                receivables: row.receivables,

                total_assets,

                payables: row.payables,

                total_liabilities,

                net_worth:

                    total_assets - total_liabilities

            });

        });

    });

};

const getCashFlow = () => {

    return new Promise((resolve, reject) => {

        const query = `

            SELECT

                COALESCE(
                    SUM(
                        CASE
                            WHEN transaction_type='Cash In'
                            THEN amount
                            ELSE 0
                        END
                    ),
                    0
                ) AS cash_in,

                COALESCE(
                    SUM(
                        CASE
                            WHEN transaction_type='Cash Out'
                            THEN amount
                            ELSE 0
                        END
                    ),
                    0
                ) AS cash_out

            FROM cash_book

        `;

        connection.query(query,(err,result)=>{

            if(err){

                return reject(err);

            }

            const row = result[0];

            resolve({

                cash_in: row.cash_in,

                cash_out: row.cash_out,

                net_cash_flow:

                    Number(row.cash_in) -
                    Number(row.cash_out)

            });

        });

    });

};

const getOutstandingPayables = () => {

    return new Promise((resolve, reject) => {

        const query = `

            SELECT

                s.supplier_id,

                s.supplier_name,

                COALESCE(
                    sl.balance,
                    0
                ) AS outstanding_balance

            FROM suppliers s

            LEFT JOIN

            (

                SELECT

                    supplier_id,

                    MAX(balance) AS balance

                FROM supplier_ledger

                GROUP BY supplier_id

            ) sl

            ON s.supplier_id = sl.supplier_id

            ORDER BY outstanding_balance DESC

        `;

        connection.query(query,(err,result)=>{

            if(err){

                return reject(err);

            }

            resolve(result);

        });

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