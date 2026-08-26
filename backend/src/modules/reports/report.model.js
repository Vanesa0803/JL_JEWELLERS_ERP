import connection from "../../config/db.js";
import financeModel from "../finance/finance.model.js";

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

const getPaymentReport = (filters) => {

    return new Promise((resolve, reject) => {

        let query = `

            SELECT

                p.payment_id,

                b.invoice_number,

                CONCAT(
                    c.first_name,
                    ' ',
                    COALESCE(c.last_name,'')
                ) AS customer,

                p.payment_date,

                pd.payment_method,

                pd.amount,

                pd.reference_number,

                p.payment_type,

                p.payment_status

            FROM payments p

            JOIN payment_details pd
            ON p.payment_id = pd.payment_id

            LEFT JOIN bills b
            ON p.bill_id = b.bill_id

            LEFT JOIN customers c
            ON b.customer_id = c.customer_id

            WHERE 1=1

        `;

        const values = [];

        if(filters.from_date){

            query +=
            " AND DATE(p.payment_date)>=?";

            values.push(filters.from_date);

        }

        if(filters.to_date){

            query +=
            " AND DATE(p.payment_date)<=?";

            values.push(filters.to_date);

        }

        if(filters.payment_method){

            query +=
            " AND pd.payment_method=?";

            values.push(filters.payment_method);

        }

        if(filters.payment_status){

            query +=
            " AND p.payment_status=?";

            values.push(filters.payment_status);

        }

        query +=
        " ORDER BY p.payment_date DESC";

        connection.query(query, values, (err,result)=>{

            if(err){

                return reject(err);

            }

            resolve(result);

        });

    });

};

const getInventoryReport = (filters) => {

    return new Promise((resolve, reject) => {

        let query = `
            SELECT
                p.product_id,
                p.product_code,
                p.product_name,

                c.category_name,
                sc.subcategory_name,

                mt.metal_name,
                pr.purity_name,

                i.available_quantity,
                i.reserved_quantity,
                i.minimum_stock,
                i.maximum_stock,
                i.stock_location,

                CASE
                    WHEN i.available_quantity = 0 THEN 'Out of Stock'
                    WHEN i.available_quantity <= i.minimum_stock THEN 'Low Stock'
                    ELSE 'In Stock'
                END AS stock_status

            FROM inventory i

            INNER JOIN products p
                ON i.product_id = p.product_id

            LEFT JOIN categories c
                ON p.category_id = c.category_id

            LEFT JOIN subcategories sc
                ON p.subcategory_id = sc.subcategory_id

            LEFT JOIN metal_types mt
                ON p.metal_type_id = mt.metal_type_id

            LEFT JOIN purity pr
                ON p.purity_id = pr.purity_id

            WHERE 1=1
        `;

        const values = [];

        if(filters.category_id){

            query += " AND p.category_id=?";

            values.push(filters.category_id);

        }

        if(filters.metal_type_id){

            query += " AND p.metal_type_id=?";

            values.push(filters.metal_type_id);

        }

        if(filters.purity_id){

            query += " AND p.purity_id=?";

            values.push(filters.purity_id);

        }

        if(filters.product_id){

            query += " AND p.product_id=?";

            values.push(filters.product_id);

        }

        if(filters.stock_status){

            if(filters.stock_status === "Low Stock"){

                query += " AND i.available_quantity<=i.minimum_stock AND i.available_quantity>0";

            }

            if(filters.stock_status === "Out of Stock"){

                query += " AND i.available_quantity=0";

            }

            if(filters.stock_status === "In Stock"){

                query += " AND i.available_quantity>i.minimum_stock";

            }

        }

        query += `
            ORDER BY
            p.product_name ASC
        `;

        connection.query(query, values, (err, result)=>{

            if(err){

                return reject(err);

            }

            resolve(result);

        });

    });

};


const getFinancialReport = async (filters = {}) => {

    const fromDate = filters.from_date || null;
    const toDate = filters.to_date || null;

    const [
        profitLoss,
        cashFlow,
        balanceSheet,
        gstSummary,
        outstandingPayables
    ] = await Promise.all([

        financeModel.getProfitLoss(
            fromDate,
            toDate
        ),

        financeModel.getCashFlow(
            fromDate,
            toDate
        ),

        financeModel.getBalanceSheet(
            fromDate,
            toDate
        ),

        financeModel.getGSTSummary(
            fromDate,
            toDate
        ),

        financeModel.getOutstandingPayables(
            fromDate,
            toDate
        )

    ]);

    return {

        profit_loss: profitLoss,

        cash_flow: cashFlow,

        balance_sheet: balanceSheet,

        gst_summary: gstSummary,

        outstanding_payables:
            outstandingPayables

    };

};

export {

    getSalesReport,
    getGSTReport,
    getCustomerReport,
    getLedgerReport,
    getPaymentReport,
    getInventoryReport,
    getFinancialReport

};

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    getSalesReport,
    getGSTReport,
    getCustomerReport,
    getLedgerReport,
    getPaymentReport,
    getInventoryReport,
    getFinancialReport
};
