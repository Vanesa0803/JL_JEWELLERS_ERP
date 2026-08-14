import { pool } from '../../config/db.js';

class CustomerLoyaltyRepository {
    async getLoyaltyHistory(customerId) {
        const query = `SELECT * FROM customer_loyalty WHERE customer_id = ? ORDER BY created_at DESC`;
        const [rows] = await pool.execute(query, [customerId]);
        return rows;
    }

    async earnPoints(customerId, pointsEarned, currentPointsAfter, remarks) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Insert into loyalty ledger
            const insertQuery = `INSERT INTO customer_loyalty (customer_id, points_earned, points_redeemed, current_points, remarks) VALUES (?, ?, ?, ?, ?)`;
            await connection.execute(insertQuery, [customerId, pointsEarned, 0, currentPointsAfter, remarks]);

            // 2. Update customer main table
            const updateQuery = `UPDATE customers SET loyalty_points = loyalty_points + ? WHERE customer_id = ?`;
            await connection.execute(updateQuery, [pointsEarned, customerId]);

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async redeemPoints(customerId, pointsRedeemed, currentPointsAfter, remarks) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Insert into loyalty ledger
            const insertQuery = `INSERT INTO customer_loyalty (customer_id, points_earned, points_redeemed, current_points, remarks) VALUES (?, ?, ?, ?, ?)`;
            await connection.execute(insertQuery, [customerId, 0, pointsRedeemed, currentPointsAfter, remarks]);

            // 2. Update customer main table
            const updateQuery = `UPDATE customers SET loyalty_points = loyalty_points - ? WHERE customer_id = ?`;
            await connection.execute(updateQuery, [pointsRedeemed, customerId]);

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default new CustomerLoyaltyRepository();
