import { pool } from '../config/db.js';

class CustomerAnalyticsRepository {
    async getPurchaseHistory(customerId) {
        const query = `
            SELECT customer_order_id, order_number, order_date, expected_delivery, 
                   order_type, total_amount, advance_amount, balance_amount, order_status
            FROM customer_orders
            WHERE customer_id = ?
            ORDER BY order_date DESC
        `;
        const [rows] = await pool.execute(query, [customerId]);
        return rows;
    }

    async getLifetimeValue(customerId) {
        const query = `
            SELECT COALESCE(SUM(total_amount), 0) AS lifetime_value,
                   COUNT(customer_order_id) AS total_orders
            FROM customer_orders
            WHERE customer_id = ? AND order_status != 'Cancelled'
        `;
        const [rows] = await pool.execute(query, [customerId]);
        return rows[0];
    }

    async getUpcomingBirthdays(daysAhead) {
        // Find customers whose birthday is within the next N days
        // This query handles year wrap-around by using DAYOFYEAR or formatting dates
        // Simplified approach for MySQL:
        const query = `
            SELECT customer_id, first_name, last_name, mobile, date_of_birth
            FROM customers
            WHERE date_of_birth IS NOT NULL
              AND DATE_ADD(
                    date_of_birth, 
                    INTERVAL YEAR(CURDATE()) - YEAR(date_of_birth)
                             + IF(DAYOFYEAR(CURDATE()) > DAYOFYEAR(date_of_birth),1,0)
                    YEAR  
                  ) BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
            ORDER BY MONTH(date_of_birth), DAY(date_of_birth)
        `;
        const [rows] = await pool.execute(query, [daysAhead]);
        return rows;
    }

    async getUpcomingAnniversaries(daysAhead) {
        const query = `
            SELECT customer_id, first_name, last_name, mobile, anniversary_date
            FROM customers
            WHERE anniversary_date IS NOT NULL
              AND DATE_ADD(
                    anniversary_date, 
                    INTERVAL YEAR(CURDATE()) - YEAR(anniversary_date)
                             + IF(DAYOFYEAR(CURDATE()) > DAYOFYEAR(anniversary_date),1,0)
                    YEAR  
                  ) BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
            ORDER BY MONTH(anniversary_date), DAY(anniversary_date)
        `;
        const [rows] = await pool.execute(query, [daysAhead]);
        return rows;
    }
}

export default new CustomerAnalyticsRepository();
