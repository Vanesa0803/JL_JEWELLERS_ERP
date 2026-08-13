const db = require("../config/db.cjs");

const createEntry = (data) => {

    return new Promise((resolve, reject) => {

        const query = `
            INSERT INTO cash_book
            (
                transaction_type,
                source,
                reference_id,
                customer_id,
                amount,
                remarks,
                created_by
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(

            query,

            [
                data.transaction_type,
                data.source,
                data.reference_id,
                data.customer_id,
                data.amount,
                data.remarks,
                data.created_by
            ],

            (err, result) => {

                if (err) return reject(err);

                resolve(result);

            }

        );

    });

};

const getCashBookStatement = () => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT *
            FROM cash_book
            ORDER BY transaction_date ASC
        `;

        db.query(query, (err, result) => {

            if (err) {

                return reject(err);

            }

            resolve(result);

        });

    });

};

module.exports = {

    createEntry,
    getCashBookStatement

};