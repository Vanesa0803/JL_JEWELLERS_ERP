import { pool } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";

class ActivityLogService {

    async getActivityLogs() {

        const [rows] = await pool.execute(
            `SELECT
                log_id,
                user_id,
                action,
                module,
                description,
                created_at
             FROM activity_logs
             ORDER BY log_id DESC`
        );

        return rows;
    }

    async createActivityLog(data) {

        const {
            user_id,
            action,
            module,
            description
        } = data;

        if (!action || !module) {
            throw new ApiError(
                400,
                "Action and module are required"
            );
        }

        const [result] = await pool.execute(
            `INSERT INTO activity_logs
                (user_id, action, module, description)
             VALUES (?, ?, ?, ?)`,
            [
                user_id ?? null,
                action,
                module,
                description ?? null
            ]
        );

        return {
            log_id: result.insertId,
            user_id: user_id ?? null,
            action,
            module,
            description: description ?? null
        };
    }
}

export default new ActivityLogService();