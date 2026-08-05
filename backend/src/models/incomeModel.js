const connection = require("../config/db");

const createIncome = (incomeData) => {

    return new Promise((resolve, reject) => {

        const query = `
            INSERT INTO income
            (
                income_type,
                amount,
                payment_method,
                income_date,
                remarks,
                created_by
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        connection.query(

            query,

            [
                incomeData.income_type,
                incomeData.amount,
                incomeData.payment_method,
                incomeData.income_date,
                incomeData.remarks,
                incomeData.created_by
            ],

            (err, result) => {

                if (err) return reject(err);

                resolve(result);

            }

        );

    });

};

const getIncomeById = (incomeId) => {

    return new Promise((resolve, reject) => {

        connection.query(

            "SELECT * FROM income WHERE income_id=?",

            [incomeId],

            (err, result) => {

                if (err) return reject(err);

                resolve(result[0]);

            }

        );

    });

};

const getIncomeHistory = () => {

    return new Promise((resolve, reject) => {

        connection.query(

            "SELECT * FROM income ORDER BY income_date DESC",

            (err, result) => {

                if (err) return reject(err);

                resolve(result);

            }

        );

    });

};

module.exports = {

    createIncome,
    getIncomeById,
    getIncomeHistory,

};
