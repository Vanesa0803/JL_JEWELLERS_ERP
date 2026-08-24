import { pool } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";

class AuditLogService {

    async getAuditLogs() {

        const [rows] = await pool.execute(
            `SELECT
                audit_id,
                user_id,
                table_name,
                record_id,
                action,
                old_data,
                new_data,
                created_at
             FROM audit_logs
             ORDER BY audit_id DESC`
        );

        return rows;
    }

    async createAuditLog(data) {

        const {
            user_id,
            table_name,
            record_id,
            action,
            old_data,
            new_data
        } = data;

        if (!table_name || !action) {
            throw new ApiError(
                400,
                "Table name and action are required"
            );
        }

        const [result] = await pool.execute(
            `INSERT INTO audit_logs
                (
                    user_id,
                    table_name,
                    record_id,
                    action,
                    old_data,
                    new_data
                )
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                user_id ?? null,
                table_name,
                record_id ?? null,
                action,
                old_data ?? null,
                new_data ?? null
            ]
        );

        return {
            audit_id: result.insertId,
            user_id: user_id ?? null,
            table_name,
            record_id: record_id ?? null,
            action,
            old_data: old_data ?? null,
            new_data: new_data ?? null
        };
    }
}

export default new AuditLogService();