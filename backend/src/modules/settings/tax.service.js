import { pool } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";

class TaxService {
    async getTaxSettings() {
        const [rows] = await pool.execute(
            `SELECT
                tax_id,
                tax_name,
                percentage,
                created_at
             FROM tax_settings
             ORDER BY tax_id ASC`
        );

        return rows;
    }

    async createTaxSetting(data) {
        const {
            tax_name,
            percentage
        } = data;

        if (
            !tax_name ||
            percentage === undefined ||
            percentage === null
        ) {
            throw new ApiError(
                400,
                "Tax name and percentage are required"
            );
        }

        const taxPercentage = Number(percentage);

        if (
            Number.isNaN(taxPercentage) ||
            taxPercentage < 0 ||
            taxPercentage > 100
        ) {
            throw new ApiError(
                400,
                "Percentage must be a number between 0 and 100"
            );
        }

        const [existing] = await pool.execute(
            `SELECT tax_id
             FROM tax_settings
             WHERE tax_name = ?
             LIMIT 1`,
            [tax_name]
        );

        if (existing.length > 0) {
            throw new ApiError(
                409,
                "Tax setting already exists"
            );
        }

        const [result] = await pool.execute(
            `INSERT INTO tax_settings
                (tax_name, percentage)
             VALUES (?, ?)`,
            [
                tax_name,
                taxPercentage
            ]
        );

        return {
            tax_id: result.insertId,
            tax_name,
            percentage: taxPercentage
        };
    }

    async updateTaxSetting(id, data) {
        const {
            tax_name,
            percentage
        } = data;

        if (
            !tax_name ||
            percentage === undefined ||
            percentage === null
        ) {
            throw new ApiError(
                400,
                "Tax name and percentage are required"
            );
        }

        const taxPercentage = Number(percentage);

        if (
            Number.isNaN(taxPercentage) ||
            taxPercentage < 0 ||
            taxPercentage > 100
        ) {
            throw new ApiError(
                400,
                "Percentage must be a number between 0 and 100"
            );
        }

        const [existing] = await pool.execute(
            `SELECT tax_id
             FROM tax_settings
             WHERE tax_id = ?
             LIMIT 1`,
            [id]
        );

        if (existing.length === 0) {
            throw new ApiError(
                404,
                "Tax setting not found"
            );
        }

        await pool.execute(
            `UPDATE tax_settings
             SET
                tax_name = ?,
                percentage = ?
             WHERE tax_id = ?`,
            [
                tax_name,
                taxPercentage,
                id
            ]
        );

        const [rows] = await pool.execute(
            `SELECT
                tax_id,
                tax_name,
                percentage,
                created_at
             FROM tax_settings
             WHERE tax_id = ?`,
            [id]
        );

        return rows[0];
    }
}

export default new TaxService();