import { pool } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";

class GstService {
    async getGst() {
        const [rows] = await pool.execute(
            `SELECT
                gst_id,
                gst_number,
                state,
                created_at
             FROM gst_details
             ORDER BY gst_id ASC
             LIMIT 1`
        );

        if (rows.length === 0) {
            throw new ApiError(404, "GST details not found");
        }

        return rows[0];
    }

    async createGst(data) {
        const { gst_number, state } = data;

        if (!gst_number || !state) {
            throw new ApiError(
                400,
                "GST number and state are required"
            );
        }

        const [existing] = await pool.execute(
            `SELECT gst_id
             FROM gst_details
             LIMIT 1`
        );

        if (existing.length > 0) {
            throw new ApiError(
                409,
                "GST details already exist"
            );
        }

        const [result] = await pool.execute(
            `INSERT INTO gst_details
                (gst_number, state)
             VALUES (?, ?)`,
            [
                gst_number,
                state
            ]
        );

        return {
            gst_id: result.insertId,
            gst_number,
            state
        };
    }

    async updateGst(data) {
        const { gst_number, state } = data;

        if (!gst_number || !state) {
            throw new ApiError(
                400,
                "GST number and state are required"
            );
        }

        const [existing] = await pool.execute(
            `SELECT gst_id
             FROM gst_details
             LIMIT 1`
        );

        if (existing.length === 0) {
            throw new ApiError(
                404,
                "GST details not found"
            );
        }

        const gstId = existing[0].gst_id;

        await pool.execute(
            `UPDATE gst_details
             SET
                gst_number = ?,
                state = ?
             WHERE gst_id = ?`,
            [
                gst_number,
                state,
                gstId
            ]
        );

        return this.getGst();
    }
}

export default new GstService();