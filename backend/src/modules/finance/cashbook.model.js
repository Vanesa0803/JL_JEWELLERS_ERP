import db from "../../config/db.js";

const createEntry = (
    data,
    dbConnection = db
) => {

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

        dbConnection.query(

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

export {

    createEntry,
    getCashBookStatement

};

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    createEntry,
    getCashBookStatement,
};
