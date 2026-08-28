import db from "../../config/db.js";

const createBankLedgerEntry = (
    data,
    dbConnection = db
) => {

    return new Promise((resolve, reject) => {

        const query = `
            INSERT INTO bank_ledger
            (
                bank_account_id,
                transaction_date,
                transaction_type,
                amount,
                description
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        dbConnection.query(
            query,
            [
                data.bank_account_id,
                data.transaction_date || new Date(),
                data.transaction_type,
                data.amount,
                data.description || null
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


const getBankLedger = (
    bankAccountId,
    dbConnection = db
) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT *
            FROM bank_ledger
            WHERE bank_account_id = ?
            ORDER BY transaction_date ASC, bank_entry_id ASC
        `;

        dbConnection.query(
            query,
            [bankAccountId],
            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result);

            }
        );

    });

};


const getBankAccount = (
    bankAccountId,
    dbConnection = db
) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT *
            FROM bank_accounts
            WHERE bank_account_id = ?
        `;

        dbConnection.query(
            query,
            [bankAccountId],
            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result[0]);

            }
        );

    });

};

const updateBankAccountBalance = (
    bankAccountId,
    newBalance,
    dbConnection = db
) => {

    return new Promise((resolve, reject) => {

        const query = `
            UPDATE bank_accounts
            SET current_balance = ?
            WHERE bank_account_id = ?
        `;

        dbConnection.query(
            query,
            [
                newBalance,
                bankAccountId
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
    createBankLedgerEntry,
    getBankLedger,
    getBankAccount,
    updateBankAccountBalance
};

export default {
    createBankLedgerEntry,
    getBankLedger,
    getBankAccount,
    updateBankAccountBalance
};