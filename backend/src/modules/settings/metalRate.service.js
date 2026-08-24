import { pool } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";

class MetalRateService {
    async getMetalRates() {
        const [rows] = await pool.execute(
            `SELECT
                rate_id,
                metal_type,
                rate,
                updated_at
             FROM metal_rates
             ORDER BY rate_id ASC`
        );

        return rows;
    }

    async createMetalRate(data) {
        const { metal_type, rate } = data;

        if (!metal_type || rate === undefined) {
            throw new ApiError(
                400,
                "Metal type and rate are required"
            );
        }

        const [result] = await pool.execute(
            `INSERT INTO metal_rates
                (metal_type, rate)
             VALUES (?, ?)`,
            [metal_type, rate]
        );

        return {
            rate_id: result.insertId,
            metal_type,
            rate
        };
    }

    async updateMetalRate(id, data) {
        const { metal_type, rate } = data;

        if (!metal_type || rate === undefined) {
            throw new ApiError(
                400,
                "Metal type and rate are required"
            );
        }

        const [existing] = await pool.execute(
            `SELECT rate_id
             FROM metal_rates
             WHERE rate_id = ?`,
            [id]
        );

        if (existing.length === 0) {
            throw new ApiError(
                404,
                "Metal rate not found"
            );
        }

        await pool.execute(
            `UPDATE metal_rates
             SET
                metal_type = ?,
                rate = ?
             WHERE rate_id = ?`,
            [metal_type, rate, id]
        );

        const [rows] = await pool.execute(
            `SELECT
                rate_id,
                metal_type,
                rate,
                updated_at
             FROM metal_rates
             WHERE rate_id = ?`,
            [id]
        );

        return rows[0];
    }
}

export default new MetalRateService();