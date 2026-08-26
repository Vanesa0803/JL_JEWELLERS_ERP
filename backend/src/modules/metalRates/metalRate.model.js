import db from "../../config/db.js";

const getLatestRate = (metalType) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT
                rate_id,
                metal_type,
                rate,
                updated_at
            FROM metal_rates
            WHERE metal_type = ?
            ORDER BY rate_id DESC
            LIMIT 1
        `;

        db.query(query, [metalType], (err, rows) => {

            if (err) {
                return reject(err);
            }

            resolve(rows[0] || null);

        });

    });

};

const createRate = (metalType, rate) => {

    return new Promise((resolve, reject) => {

        const query = `
            INSERT INTO metal_rates
            (
                metal_type,
                rate
            )
            VALUES (?, ?)
        `;

        db.query(
            query,
            [metalType, rate],
            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result);

            }
        );

    });

};

export {
    getLatestRate,
    createRate
};

export default {
    getLatestRate,
    createRate
};