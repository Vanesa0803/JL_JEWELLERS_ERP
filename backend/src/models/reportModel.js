const connection = require("../config/db");

const getSalesReport = (filters) => {

    return new Promise((resolve, reject) => {

        let query = `

            SELECT

                b.bill_id,

                b.invoice_number,

                CONCAT(
                    c.first_name,
                    ' ',
                    COALESCE(c.last_name,'')
                ) AS customer,

                b.bill_date,

                b.subtotal,

                b.total_discount,

                b.total_gst,

                b.grand_total,

                b.payment_status,

                b.bill_status

            FROM bills b

            JOIN customers c

            ON b.customer_id = c.customer_id

            WHERE b.deleted_at IS NULL

        `;

        const values = [];

        if(filters.from_date){

            query +=
            " AND DATE(b.bill_date)>=?";

            values.push(filters.from_date);

        }

        if(filters.to_date){

            query +=
            " AND DATE(b.bill_date)<=?";

            values.push(filters.to_date);

        }

        if(filters.customer_id){

            query +=
            " AND b.customer_id=?";

            values.push(filters.customer_id);

        }

        if(filters.employee_id){

            query +=
            " AND b.employee_id=?";

            values.push(filters.employee_id);

        }

        if(filters.status){

            query +=
            " AND b.bill_status=?";

            values.push(filters.status);

        }

        query +=
        " ORDER BY b.bill_date DESC";

        connection.query(

            query,

            values,

            (err,result)=>{

                if(err){

                    return reject(err);

                }

                resolve(result);

            }

        );

    });

};

const getGSTReport = (filters) => {

    return new Promise((resolve, reject) => {

        let query = `

            SELECT

                b.bill_id,

                b.invoice_number,

                DATE(b.bill_date) AS bill_date,

                CONCAT(
                    c.first_name,
                    ' ',
                    COALESCE(c.last_name,'')
                ) AS customer,

                b.subtotal,

                b.total_gst,

                b.grand_total

            FROM bills b

            JOIN customers c
            ON b.customer_id = c.customer_id

            WHERE b.deleted_at IS NULL

        `;

        const values = [];

        if(filters.from_date){

            query += " AND DATE(b.bill_date) >= ?";

            values.push(filters.from_date);

        }

        if(filters.to_date){

            query += " AND DATE(b.bill_date) <= ?";

            values.push(filters.to_date);

        }

        query += " ORDER BY b.bill_date DESC";

        connection.query(

            query,

            values,

            (err,result)=>{

                if(err){

                    return reject(err);

                }

                resolve(result);

            }

        );

    });

};

const getCustomerReport = (filters) => {

    return new Promise((resolve, reject) => {

        let query = `

            SELECT
                c.customer_id,
                c.customer_code,
                CONCAT(
                    c.first_name,
                    ' ',
                    COALESCE(c.last_name, '')
                ) AS customer_name,

                c.mobile,
                c.city,

                COALESCE(SUM(b.grand_total),0) AS total_purchases,

                COALESCE(
                    SUM(b.grand_total),
                    0
                ) -
                COALESCE(
                    SUM(p.total_paid),
                    0
                ) AS pending_amount

            FROM customers c

            LEFT JOIN bills b
            ON c.customer_id = b.customer_id
            AND b.bill_status = 'Completed'

            LEFT JOIN
            (
                SELECT
                    bill_id,
                    SUM(total_amount) AS total_paid
                FROM payments
                WHERE payment_status IN ('Partial','Completed')
                GROUP BY bill_id
            ) p
            ON b.bill_id = p.bill_id

            WHERE 1=1
        `;

        const values = [];

        if(filters.customer_id){

            query += " AND c.customer_id=?";

            values.push(filters.customer_id);

        }

        if(filters.city){

            query += " AND c.city=?";

            values.push(filters.city);

        }

        if(filters.status){

            query += " AND c.status=?";

            values.push(filters.status);

        }

        query += `

            GROUP BY
                c.customer_id

            ORDER BY
                customer_name ASC

        `;

        connection.query(query, values, (err,result)=>{

            if(err){

                return reject(err);

            }

            resolve(result);

        });

    });

};

const getLedgerReport = (filters) => {

    return new Promise((resolve, reject) => {

        let query = `

            SELECT

                cl.ledger_id,

                cl.customer_id,

                CONCAT(
                    c.first_name,
                    ' ',
                    COALESCE(c.last_name,'')
                ) AS customer,

                cl.bill_id,

                cl.transaction_type,

                cl.debit,

                cl.credit,

                cl.balance,

                cl.remarks,

                cl.created_at

            FROM customer_ledger cl

            JOIN customers c

            ON cl.customer_id = c.customer_id

            WHERE 1=1

        `;

        const values = [];

        if (filters.customer_id) {

            query += " AND cl.customer_id=?";

            values.push(filters.customer_id);

        }

        if (filters.from_date) {

            query += " AND DATE(cl.created_at)>=?";

            values.push(filters.from_date);

        }

        if (filters.to_date) {

            query += " AND DATE(cl.created_at)<=?";

            values.push(filters.to_date);

        }

        if (filters.transaction_type) {

            query += " AND cl.transaction_type=?";

            values.push(filters.transaction_type);

        }

        query += " ORDER BY cl.created_at DESC";

        connection.query(query, values, (err, result) => {

            if (err) {

                return reject(err);

            }

            resolve(result);

        });

    });

};

module.exports = {

    getSalesReport,
    getGSTReport,
    getCustomerReport,
    getLedgerReport

};