import { pool } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";

class BarcodeService {
    async getBarcodeSettings() {
        const [rows] = await pool.execute(
            `SELECT
                barcode_id,
                format,
                prefix,
                created_at
             FROM barcode_settings
             ORDER BY barcode_id ASC
             LIMIT 1`
        );

        if (rows.length === 0) {
            throw new ApiError(404, "Barcode settings not found");
        }

        return rows[0];
    }

    async createBarcodeSettings(data) {
        const { format, prefix } = data;

        if (format === undefined || prefix === undefined) {
            throw new ApiError(
                400,
                "Format and prefix are required"
            );
        }

        const [existing] = await pool.execute(
            `SELECT barcode_id
             FROM barcode_settings
             LIMIT 1`
        );

        if (existing.length > 0) {
            throw new ApiError(
                409,
                "Barcode settings already exist"
            );
        }

        const [result] = await pool.execute(
            `INSERT INTO barcode_settings
                (format, prefix)
             VALUES (?, ?)`,
            [format, prefix]
        );

        return {
            barcode_id: result.insertId,
            format,
            prefix
        };
    }

    async updateBarcodeSettings(data) {
        const { format, prefix } = data;

        if (format === undefined || prefix === undefined) {
            throw new ApiError(
                400,
                "Format and prefix are required"
            );
        }

        const [existing] = await pool.execute(
            `SELECT barcode_id
             FROM barcode_settings
             LIMIT 1`
        );

        if (existing.length === 0) {
            throw new ApiError(
                404,
                "Barcode settings not found"
            );
        }

        const barcodeId = existing[0].barcode_id;

        await pool.execute(
            `UPDATE barcode_settings
             SET
                format = ?,
                prefix = ?
             WHERE barcode_id = ?`,
            [format, prefix, barcodeId]
        );

        return this.getBarcodeSettings();
    }
}

export default new BarcodeService();