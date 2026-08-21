import { pool } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";

class InvoiceService {
    async getInvoiceSettings() {
        const [rows] = await pool.execute(
            `SELECT
                invoice_id,
                prefix,
                suffix,
                starting_number,
                created_at
             FROM invoice_settings
             ORDER BY invoice_id ASC
             LIMIT 1`
        );

        if (rows.length === 0) {
            throw new ApiError(404, "Invoice settings not found");
        }

        return rows[0];
    }

    async createInvoiceSettings(data) {
        const {
            prefix,
            suffix,
            starting_number
        } = data;

        if (
            prefix === undefined ||
            suffix === undefined ||
            starting_number === undefined
        ) {
            throw new ApiError(
                400,
                "Prefix, suffix and starting number are required"
            );
        }

        const [existing] = await pool.execute(
            `SELECT invoice_id
             FROM invoice_settings
             LIMIT 1`
        );

        if (existing.length > 0) {
            throw new ApiError(
                409,
                "Invoice settings already exist"
            );
        }

        const [result] = await pool.execute(
            `INSERT INTO invoice_settings
                (prefix, suffix, starting_number)
             VALUES (?, ?, ?)`,
            [
                prefix,
                suffix,
                starting_number
            ]
        );

        return {
            invoice_id: result.insertId,
            prefix,
            suffix,
            starting_number
        };
    }

    async updateInvoiceSettings(data) {
        const {
            prefix,
            suffix,
            starting_number
        } = data;

        if (
            prefix === undefined ||
            suffix === undefined ||
            starting_number === undefined
        ) {
            throw new ApiError(
                400,
                "Prefix, suffix and starting number are required"
            );
        }

        const [existing] = await pool.execute(
            `SELECT invoice_id
             FROM invoice_settings
             LIMIT 1`
        );

        if (existing.length === 0) {
            throw new ApiError(
                404,
                "Invoice settings not found"
            );
        }

        const invoiceId = existing[0].invoice_id;

        await pool.execute(
            `UPDATE invoice_settings
             SET
                prefix = ?,
                suffix = ?,
                starting_number = ?
             WHERE invoice_id = ?`,
            [
                prefix,
                suffix,
                starting_number,
                invoiceId
            ]
        );

        return this.getInvoiceSettings();
    }
}

export default new InvoiceService();