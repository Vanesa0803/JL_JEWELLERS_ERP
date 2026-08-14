import db from "../../config/db.js";

const createFinancialPin = (pinHash) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            INSERT INTO financial_pin
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
            FROM financial_pin
            ORDER BY pin_id
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
            UPDATE financial_pin

            SET

                pin_hash = ?

            WHERE pin_id = (SELECT pin_id FROM (SELECT MIN(pin_id) AS pin_id FROM financial_pin) AS current_pin)
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
            -- These are business settings, not properties of a PIN, so they
            -- live in financial_settings, which already had
            -- max_discount_percent. Only max_rate_change_percent had to be
            -- added (migration 2026-08-13_04). The original code wrote both to
            -- a financial_security table that never existed (S0-8).
            UPDATE financial_settings

            SET

                max_discount_percent = ?,

                max_rate_change_percent = ?

            WHERE setting_id = 1
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

export {

    createFinancialPin,

    getFinancialSecurity,

    updateFinancialPin,

    updateSecuritySettings

};

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    createFinancialPin,
    getFinancialSecurity,
    updateFinancialPin,
    updateSecuritySettings,
};
