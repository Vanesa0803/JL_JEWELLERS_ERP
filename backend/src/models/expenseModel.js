const connection = require("../config/db");

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

const getExpenseHistory = () => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT *
            FROM expenses
            ORDER BY expense_date DESC
        `;

        connection.query(query, (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result);

        });

    });

};

module.exports = {

    createExpense,
    getExpenseById,
    getExpenseHistory

};