const connection = require("../config/db");

const createLedgerEntry = (ledgerData) => {

    return new Promise((resolve, reject) => {

        const query = `
            INSERT INTO customer_ledger
            (
                customer_id,
                bill_id,
                transaction_type,
                debit,
                credit,
                balance,
                remarks
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(

            query,

            [
                ledgerData.customer_id,
                ledgerData.bill_id || null,
                ledgerData.transaction_type,
                ledgerData.debit,
                ledgerData.credit,
                ledgerData.balance,
                ledgerData.remarks || null
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

const getCustomerLedger = (customerId) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT *
            FROM customer_ledger
            WHERE customer_id = ?
            ORDER BY ledger_id ASC
        `;

        connection.query(query, [customerId], (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result);

        });

    });

};

const getLedgerStatement = (customerId) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT
                cl.ledger_id,
                cl.customer_id,
                cl.bill_id,
                cl.transaction_type,
                cl.debit,
                cl.credit,
                cl.balance,
                cl.remarks,
                cl.created_at,
                c.first_name,
                c.last_name
            FROM customer_ledger cl
            INNER JOIN customers c
                ON cl.customer_id = c.customer_id
            WHERE cl.customer_id = ?
            ORDER BY cl.created_at ASC
        `;

        connection.query(query, [customerId], (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result);

        });

    });

};

const getOutstandingBalance = (customerId) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT

                c.customer_id,

                CONCAT(c.first_name,' ',c.last_name)
                AS customer_name,

                COALESCE(SUM(cl.debit),0)
                AS total_debit,

                COALESCE(SUM(cl.credit),0)
                AS total_credit

            FROM customers c

            LEFT JOIN customer_ledger cl

                ON c.customer_id = cl.customer_id

            WHERE c.customer_id = ?

            GROUP BY c.customer_id
        `;

        connection.query(query,[customerId],(err,result)=>{

            if(err){
                return reject(err);
            }

            resolve(result[0]);

        });

    });

};

module.exports = {

    createLedgerEntry,
    getCustomerLedger,
    getLedgerStatement,
    getOutstandingBalance

};

