const db = require("../config/db");

const createFinancialPin = (pinHash) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            INSERT INTO financial_security
            (
                pin_hash
            )

            VALUES
            (?)
            `,

            [pinHash],

            (err, result) => {

                if (err) {

                    return reject(err);

                }

                resolve(result);

            }

        );

    });

};

const getFinancialSecurity = () => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT *
            FROM financial_security
            LIMIT 1
            `,

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                resolve(rows[0]);

            }

        );

    });

};

const updateFinancialPin = (pinHash) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            UPDATE financial_security

            SET

                pin_hash = ?

            WHERE security_id = 1
            `,

            [pinHash],

            (err, result) => {

                if (err) {

                    return reject(err);

                }

                resolve(result);

            }

        );

    });

};

const updateSecuritySettings = (
    maxDiscount,
    maxRateChange
) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            UPDATE financial_security

            SET

                max_discount_percent = ?,

                max_rate_change_percent = ?

            WHERE security_id = 1
            `,

            [

                maxDiscount,

                maxRateChange

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

module.exports = {

    createFinancialPin,

    getFinancialSecurity,

    updateFinancialPin,

    updateSecuritySettings

};