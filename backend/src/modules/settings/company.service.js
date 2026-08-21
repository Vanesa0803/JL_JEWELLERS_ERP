import { pool } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";

class CompanyService {
    async getCompany() {
        const [rows] = await pool.execute(
            `SELECT
                company_id,
                company_name,
                owner_name,
                phone,
                email,
                address,
                created_at
             FROM company_details
             ORDER BY company_id ASC
             LIMIT 1`
        );

        if (rows.length === 0) {
            throw new ApiError(404, "Company details not found");
        }

        return rows[0];
    }

    async createCompany(data) {
        const {
            company_name,
            owner_name,
            phone,
            email,
            address
        } = data;

        if (!company_name || !owner_name || !phone || !email || !address) {
            throw new ApiError(
                400,
                "Company name, owner name, phone, email and address are required"
            );
        }

        const [existing] = await pool.execute(
            `SELECT company_id
             FROM company_details
             LIMIT 1`
        );

        if (existing.length > 0) {
            throw new ApiError(
                409,
                "Company details already exist"
            );
        }

        const [result] = await pool.execute(
            `INSERT INTO company_details
                (company_name, owner_name, phone, email, address)
             VALUES (?, ?, ?, ?, ?)`,
            [
                company_name,
                owner_name,
                phone,
                email,
                address
            ]
        );

        return {
            company_id: result.insertId,
            company_name,
            owner_name,
            phone,
            email,
            address
        };
    }

    async updateCompany(data) {
        const {
            company_name,
            owner_name,
            phone,
            email,
            address
        } = data;

        if (!company_name || !owner_name || !phone || !email || !address) {
            throw new ApiError(
                400,
                "Company name, owner name, phone, email and address are required"
            );
        }

        const [existing] = await pool.execute(
            `SELECT company_id
             FROM company_details
             LIMIT 1`
        );

        if (existing.length === 0) {
            throw new ApiError(
                404,
                "Company details not found"
            );
        }

        const companyId = existing[0].company_id;

        await pool.execute(
            `UPDATE company_details
             SET
                company_name = ?,
                owner_name = ?,
                phone = ?,
                email = ?,
                address = ?
             WHERE company_id = ?`,
            [
                company_name,
                owner_name,
                phone,
                email,
                address,
                companyId
            ]
        );

        return this.getCompany();
    }
}

export default new CompanyService();