const connection = require("../config/db.cjs");

const createExpense = (expenseData) => {

    return new Promise((resolve, reject) => {

        const query = `
            INSERT INTO expenses
            (
                expense_type,
                amount,
                payment_method,
                expense_date,
                remarks,
                created_by
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        connection.query(

            query,

            [
                expenseData.expense_type,
                expenseData.amount,
                expenseData.payment_method,
                expenseData.expense_date,
                expenseData.remarks,
                expenseData.created_by
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

const getExpenseById = (expenseId) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT *
            FROM expenses
            WHERE expense_id = ?
        `;

        connection.query(query, [expenseId], (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result[0]);

        });

    });

};

const getExpenseHistory = (fromDate, toDate) => {

    return new Promise((resolve, reject) => {

        let query = `
            SELECT *
            FROM expenses
        `;

        let params = [];

        if (fromDate && toDate) {

            query += `
                WHERE expense_date BETWEEN ? AND ?
            `;

            params.push(fromDate, toDate);

        }
        else if (fromDate) {

            query += `
                WHERE expense_date >= ?
            `;

            params.push(fromDate);

        }
        else if (toDate) {

            query += `
                WHERE expense_date <= ?
            `;

            params.push(toDate);

        }

        query += `
            ORDER BY expense_date DESC
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

    createExpense,
    getExpenseById,
    getExpenseHistory

};