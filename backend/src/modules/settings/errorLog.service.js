import { pool } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";

class ErrorLogService {

    async getErrorLogs() {

        const [rows] = await pool.execute(
            `SELECT
                error_id,
                error_message,
                stack_trace,
                created_at
             FROM error_logs
             ORDER BY error_id DESC`
        );

        return rows;
    }

    async createErrorLog(data) {

        const {
            error_message,
            stack_trace
        } = data;

        if (!error_message) {
            throw new ApiError(
                400,
                "Error message is required"
            );
        }

        const [result] = await pool.execute(
            `INSERT INTO error_logs
                (error_message, stack_trace)
             VALUES (?, ?)`,
            [
                error_message,
                stack_trace ?? null
            ]
        );

        return {
            error_id: result.insertId,
            error_message,
            stack_trace: stack_trace ?? null
        };
    }
}

export default new ErrorLogService();