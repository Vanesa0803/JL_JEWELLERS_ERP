import { pool } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";

class DiscountService {
    async getDiscountSettings() {
        const [rows] = await pool.execute(
            `SELECT
                discount_id,
                max_discount_percentage,
                created_at
             FROM discount_settings
             ORDER BY discount_id ASC
             LIMIT 1`
        );

        if (rows.length === 0) {
            throw new ApiError(404, "Discount settings not found");
        }

        return rows[0];
    }

    async createDiscountSettings(data) {
        const { max_discount_percentage } = data;

        if (max_discount_percentage === undefined) {
            throw new ApiError(
                400,
                "Maximum discount percentage is required"
            );
        }

        if (
            Number(max_discount_percentage) < 0 ||
            Number(max_discount_percentage) > 100
        ) {
            throw new ApiError(
                400,
                "Discount percentage must be between 0 and 100"
            );
        }

        const [existing] = await pool.execute(
            `SELECT discount_id
             FROM discount_settings
             LIMIT 1`
        );

        if (existing.length > 0) {
            throw new ApiError(
                409,
                "Discount settings already exist"
            );
        }

        const [result] = await pool.execute(
            `INSERT INTO discount_settings
                (max_discount_percentage)
             VALUES (?)`,
            [max_discount_percentage]
        );

        return {
            discount_id: result.insertId,
            max_discount_percentage
        };
    }

    async updateDiscountSettings(data) {
        const { max_discount_percentage } = data;

        if (max_discount_percentage === undefined) {
            throw new ApiError(
                400,
                "Maximum discount percentage is required"
            );
        }

        if (
            Number(max_discount_percentage) < 0 ||
            Number(max_discount_percentage) > 100
        ) {
            throw new ApiError(
                400,
                "Discount percentage must be between 0 and 100"
            );
        }

        const [existing] = await pool.execute(
            `SELECT discount_id
             FROM discount_settings
             LIMIT 1`
        );

        if (existing.length === 0) {
            throw new ApiError(
                404,
                "Discount settings not found"
            );
        }

        const discountId = existing[0].discount_id;

        await pool.execute(
            `UPDATE discount_settings
             SET max_discount_percentage = ?
             WHERE discount_id = ?`,
            [max_discount_percentage, discountId]
        );

        return this.getDiscountSettings();
    }
}

export default new DiscountService();