const db = require("../config/db");

const getSalesTarget = () => {

    return new Promise((resolve, reject) => {

        const monthlyTarget = 1500000;

        db.query(

            `
            SELECT
            COALESCE(SUM(grand_total),0) AS current_sales
            FROM bills
            WHERE bill_status='Completed'
            `,

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                const currentSales =
                    Number(rows[0].current_sales);

                const achievement =
                    monthlyTarget === 0
                        ? 0
                        : (currentSales / monthlyTarget) * 100;

                resolve({

                    monthly_target: monthlyTarget,

                    current_sales: Number(currentSales.toFixed(2)),

                    achievement_percentage:
                        Number(achievement.toFixed(2)),

                    remaining_target:
                        Number((monthlyTarget - currentSales).toFixed(2))

                });

            }

        );

    });

};

const getMonthlyRevenue = () => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                MONTHNAME(bill_date) AS month,

                MONTH(bill_date) AS month_number,

                COALESCE(SUM(grand_total),0) AS revenue

            FROM bills

            WHERE bill_status='Completed'

            GROUP BY MONTH(bill_date), MONTHNAME(bill_date)

            ORDER BY MONTH(bill_date)
            `,

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                resolve(rows);

            }

        );

    });

};

const getYearlyRevenue = () => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                YEAR(bill_date) AS year,

                COALESCE(SUM(grand_total),0) AS revenue

            FROM bills

            WHERE bill_status='Completed'

            GROUP BY YEAR(bill_date)

            ORDER BY YEAR(bill_date)
            `,

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                resolve(rows);

            }

        );

    });

};

const getRevenueComparison = () => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                SUM(
                    CASE
                        WHEN YEAR(bill_date)=latest_year
                         AND MONTH(bill_date)=latest_month
                        THEN grand_total
                        ELSE 0
                    END
                ) AS current_month,

                SUM(
                    CASE
                        WHEN YEAR(bill_date)=previous_year
                         AND MONTH(bill_date)=previous_month
                        THEN grand_total
                        ELSE 0
                    END
                ) AS previous_month

            FROM bills

            CROSS JOIN (

                SELECT

                    YEAR(MAX(bill_date)) AS latest_year,

                    MONTH(MAX(bill_date)) AS latest_month,

                    YEAR(DATE_SUB(MAX(bill_date), INTERVAL 1 MONTH)) AS previous_year,

                    MONTH(DATE_SUB(MAX(bill_date), INTERVAL 1 MONTH)) AS previous_month

                FROM bills

                WHERE bill_status='Completed'

            ) d

            WHERE bill_status='Completed'
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

const getProfitTrends = () => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                revenue.year,
                revenue.month_number,
                revenue.month,
                revenue.revenue,

                COALESCE(exp.expenses,0) AS expenses

            FROM

            (

                SELECT

                    YEAR(bill_date) AS year,
                    MONTH(bill_date) AS month_number,
                    MONTHNAME(bill_date) AS month,

                    SUM(grand_total) AS revenue

                FROM bills

                WHERE bill_status='Completed'

                GROUP BY

                    YEAR(bill_date),
                    MONTH(bill_date),
                    MONTHNAME(bill_date)

            ) revenue

            LEFT JOIN

            (

                SELECT

                    YEAR(expense_date) AS year,
                    MONTH(expense_date) AS month_number,

                    SUM(amount) AS expenses

                FROM expenses

                GROUP BY

                    YEAR(expense_date),
                    MONTH(expense_date)

            ) exp

            ON

                revenue.year = exp.year

            AND

                revenue.month_number = exp.month_number

            ORDER BY

                revenue.year,
                revenue.month_number

            `,

            (err, rows) => {

                if(err){

                    return reject(err);

                }

                resolve(rows);

            }

        );

    });

};

const getCustomerAnalytics = () => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                COUNT(*) AS total_customers,

                COUNT(
                    CASE
                        WHEN DATE_FORMAT(created_at,'%Y-%m')
                        =
                        DATE_FORMAT(CURDATE(),'%Y-%m')
                        THEN 1
                    END
                ) AS new_customers,

                (
                    SELECT COUNT(DISTINCT customer_id)
                    FROM bills
                    WHERE bill_status='Completed'
                ) AS active_customers,

                (
                    SELECT
                    COALESCE(AVG(grand_total),0)
                    FROM bills
                    WHERE bill_status='Completed'
                ) AS average_purchase

            FROM customers
            `,

            (err, rows) => {

                if(err){

                    return reject(err);

                }

                resolve(rows[0]);

            }

        );

    });

};

const getInventoryAnalytics = () => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                COUNT(*) AS total_products,

                SUM(available_quantity) AS total_stock,

                SUM(
                    CASE
                        WHEN available_quantity <= minimum_stock
                        THEN 1
                        ELSE 0
                    END
                ) AS low_stock,

                SUM(
                    CASE
                        WHEN available_quantity = 0
                        THEN 1
                        ELSE 0
                    END
                ) AS out_of_stock,

                ROUND(AVG(available_quantity),2) AS average_stock

            FROM inventory
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

const getFinancialAnalytics = () => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                (SELECT COALESCE(SUM(amount),0) FROM income)
                    AS total_income,

                (SELECT COALESCE(SUM(amount),0) FROM expenses)
                    AS total_expenses,

                (SELECT COALESCE(SUM(amount),0)
                 FROM income
                 WHERE payment_method='Cash')
                    AS cash_income,

                (SELECT COALESCE(SUM(amount),0)
                 FROM income
                 WHERE payment_method='UPI')
                    AS upi_income,

                (SELECT COALESCE(SUM(amount),0)
                 FROM income
                 WHERE payment_method='Card')
                    AS card_income,

                (SELECT COALESCE(SUM(amount),0)
                 FROM income
                 WHERE payment_method='Bank Transfer')
                    AS bank_transfer_income
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

module.exports = {

    getSalesTarget,
    getMonthlyRevenue,
    getYearlyRevenue,
    getRevenueComparison,
    getProfitTrends,
    getCustomerAnalytics,
    getInventoryAnalytics,
    getFinancialAnalytics

};