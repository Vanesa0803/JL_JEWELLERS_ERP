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

module.exports = {

    getProfitLossSummary,
    getCashFlowSummary

};