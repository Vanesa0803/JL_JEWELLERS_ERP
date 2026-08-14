import connection from "../../config/db.js";

const getDashboardSummary = () => {

    return new Promise((resolve, reject) => {

        const query = `

            SELECT

                (
                    SELECT COALESCE(SUM(grand_total), 0)
                    FROM bills
                    WHERE DATE(bill_date) = CURDATE()
                    AND bill_status = 'Completed'
                    AND deleted_at IS NULL
                ) AS today_sales,

                (
                    SELECT COUNT(*)
                    FROM bills
                    WHERE DATE(bill_date) = CURDATE()
                    AND deleted_at IS NULL
                ) AS today_bills,

                (
                    SELECT COALESCE(SUM(amount), 0)
                    FROM income
                ) AS revenue,

                (
                    SELECT
                        COALESCE((SELECT SUM(amount) FROM income), 0)
                        -
                        COALESCE((SELECT SUM(amount) FROM expenses), 0)
                ) AS profit,

                (
                    SELECT
                        COALESCE(
                            SUM(
                                CASE
                                    WHEN transaction_type = 'Cash In'
                                    THEN amount
                                    ELSE -amount
                                END
                            ),
                            0
                        )
                    FROM cash_ledger
                ) AS cash_flow,

                (
                    SELECT
                        COALESCE(
                            SUM(
                                b.grand_total -
                                COALESCE(p.total_paid, 0)
                            ),
                            0
                        )
                    FROM bills b

                    LEFT JOIN (

                        SELECT
                            bill_id,
                            SUM(total_amount) AS total_paid

                        FROM payments

                        WHERE payment_type = 'Bill Payment'
                        AND payment_status IN ('Partial', 'Completed')

                        GROUP BY bill_id

                    ) p

                    ON b.bill_id = p.bill_id

                    WHERE b.payment_status <> 'Completed'
                    AND b.bill_status <> 'Cancelled'
                    AND b.deleted_at IS NULL

                ) AS pending_payments,

                (
                    SELECT
                        COUNT(*)
                    FROM customer_orders
                    WHERE order_status IN (
                        'Pending',
                        'Approved',
                        'In Production',
                        'Ready'
                    )
                ) AS pending_orders,

                (
                    SELECT COALESCE(
                        SUM(
                            i.available_quantity *
                            COALESCE(
                                (
                                    SELECT MAX(gri.purchase_rate)
                                    FROM goods_receipt_items gri
                                    WHERE gri.product_id = i.product_id
                                ),
                                0
                            )
                        ),
                        0
                    )
                    FROM inventory i
                ) AS inventory_value,

                (
                    SELECT COALESCE(SUM(COALESCE(available_quantity, 0)), 0)
                    FROM inventory
                ) AS inventory_quantity,

                (
                    SELECT rate
                    FROM metal_rates
                    WHERE metal_type = 'Gold'
                    ORDER BY rate_id DESC
                    LIMIT 1
                ) AS gold_rate,

                (
                    SELECT rate
                    FROM metal_rates
                    WHERE metal_type = 'Silver'
                    ORDER BY rate_id DESC
                    LIMIT 1
                ) AS silver_rate

        `;

        connection.query(query, (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result[0]);

        });

    });

};


const getSalesOverview = () => {

    return new Promise((resolve, reject) => {

        const query = `

            SELECT

                DATE(bill_date) AS date,

                COALESCE(SUM(grand_total), 0) AS sales

            FROM bills

            WHERE bill_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)

            AND bill_status = 'Completed'

            AND deleted_at IS NULL

            GROUP BY DATE(bill_date)

            ORDER BY DATE(bill_date)

        `;

        connection.query(query, (err, result) => {

            if (err) {

                return reject(err);

            }

            resolve(result);

        });

    });

};

const getRecentBills = () => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT

                b.invoice_number,

                CONCAT(
                    c.first_name,
                    ' ',
                    COALESCE(c.last_name, '')
                ) AS customer_name,

                b.grand_total,

                b.bill_date

            FROM bills b

            JOIN customers c

            ON b.customer_id = c.customer_id

            WHERE b.deleted_at IS NULL

            ORDER BY b.bill_date DESC

            LIMIT 5
        `;

        connection.query(query, (err, result) => {

            if (err) {

                return reject(err);

            }

            resolve(result);

        });

    });

};

const getRecentActivities = () => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT
                type,
                activity,
                created_at
            FROM (
                SELECT

                    'Bill' AS type,

                    CONCAT('Invoice ', invoice_number, ' Created') AS activity,

                    created_at

                FROM bills

                UNION ALL

                SELECT

                    'Payment' AS type,

                    'Payment Received' AS activity,

                    created_at

                FROM payments

            ) activities

            ORDER BY created_at DESC

            LIMIT 10
        `;

        connection.query(query, (err, result) => {

            if (err) {

                return reject(err);

            }

            resolve(result);

        });

    });

};

const getLowStockProducts = () => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT

                p.product_name,

                i.available_quantity,

                i.minimum_stock

            FROM inventory i

            JOIN products p

            ON i.product_id = p.product_id

            WHERE i.available_quantity <= i.minimum_stock

            ORDER BY i.available_quantity ASC

            LIMIT 10
        `;

        connection.query(query, (err, result) => {

            if (err) return reject(err);

            resolve(result);

        });

    });

};

const getTopSellingProducts = () => {

    return new Promise((resolve, reject) => {

        const query = `

            SELECT

                p.product_name,

                COALESCE(SUM(bi.quantity), 0) AS total_sold

            FROM bill_items bi

            JOIN bills b
                ON bi.bill_id = b.bill_id

            JOIN products p
                ON bi.product_id = p.product_id

            WHERE b.bill_status = 'Completed'

            AND b.deleted_at IS NULL

            GROUP BY
                bi.product_id,
                p.product_name

            ORDER BY total_sold DESC

            LIMIT 5

        `;

        connection.query(query, (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result);

        });

    });

};

const getSalesAnalytics = (fromDate, toDate) => {

    return new Promise((resolve, reject) => {

        let query = `

            SELECT

                DATE(bill_date) AS date,

                COALESCE(SUM(grand_total), 0) AS sales

            FROM bills

            WHERE bill_status = 'Completed'
            AND deleted_at IS NULL

        `;

        const params = [];

        if (fromDate) {

            query += ` AND DATE(bill_date) >= ? `;

            params.push(fromDate);

        }

        if (toDate) {

            query += ` AND DATE(bill_date) <= ? `;

            params.push(toDate);

        }

        query += `

            GROUP BY DATE(bill_date)

            ORDER BY DATE(bill_date)

        `;

        connection.query(
            query,
            params,
            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result);

            }
        );

    });

};

const getInventoryDashboard = () => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT

                COUNT(DISTINCT p.product_id) AS total_products,

                COALESCE(SUM(i.available_quantity),0) AS total_stock,

                COALESCE(
                    SUM(
                        i.available_quantity *
                        COALESCE(gri.purchase_rate,0)
                    ),
                    0
                ) AS inventory_value,

                SUM(
                    CASE
                        WHEN i.available_quantity <= i.minimum_stock
                        THEN 1
                        ELSE 0
                    END
                ) AS low_stock_products,

                COALESCE(
                    SUM(
                        CASE
                            WHEN available_quantity = 0 THEN 1
                            ELSE 0
                        END
                    ),
                0
                ) AS out_of_stock

                ,

                COALESCE((
                    SELECT SUM(quantity)
                    FROM stock_movements
                    WHERE movement_type = 'Purchase'
                ),0) AS purchased_quantity,

                COALESCE((
                    SELECT SUM(quantity)
                    FROM stock_movements
                    WHERE movement_type = 'Sale'
                ),0) AS sold_quantity,

                COALESCE((
                    SELECT SUM(quantity)
                    FROM stock_movements
                    WHERE movement_type = 'Return'
                ),0) AS returned_quantity,

                COALESCE((
                    SELECT SUM(quantity)
                    FROM stock_movements
                    WHERE movement_type = 'Repair'
                ),0) AS repair_quantity

            FROM inventory i

            JOIN products p
                ON i.product_id = p.product_id

            LEFT JOIN (
                SELECT
                    product_id,
                    MAX(purchase_rate) AS purchase_rate
                FROM goods_receipt_items
                GROUP BY product_id
            ) gri
                ON p.product_id = gri.product_id;
        `;

        connection.query(query, (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result[0]);

        });

    });

};

const getStockMovement = ()=>{

    return new Promise((resolve,reject)=>{

        const query = `

            SELECT

                COALESCE(SUM(
                    CASE
                        WHEN movement_type='Purchase'
                        THEN quantity
                        ELSE 0
                    END
                ),0) AS purchased_quantity,

                COALESCE(SUM(
                    CASE
                        WHEN movement_type='Sale'
                        THEN quantity
                        ELSE 0
                    END
                ),0) AS sold_quantity,

                COALESCE(SUM(
                    CASE
                        WHEN movement_type='Return'
                        THEN quantity
                        ELSE 0
                    END
                ),0) AS returned_quantity,

                COALESCE(SUM(
                    CASE
                        WHEN movement_type='Repair'
                        THEN quantity
                        ELSE 0
                    END
                ),0) AS repair_quantity

            FROM stock_movements;

        `;

        connection.query(query,(err,result)=>{

            if(err){

                return reject(err);

            }

            resolve(result[0]);

        });

    });

};

export {

    getDashboardSummary,

    getSalesOverview,

    getRecentBills,

    getRecentActivities,

    getLowStockProducts,

    getTopSellingProducts,

    getSalesAnalytics,

    getInventoryDashboard,

    getStockMovement

};

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    getDashboardSummary,
    getSalesOverview,
    getRecentBills,
    getRecentActivities,
    getLowStockProducts,
    getTopSellingProducts,
    getSalesAnalytics,
    getInventoryDashboard,
    getStockMovement,
};
