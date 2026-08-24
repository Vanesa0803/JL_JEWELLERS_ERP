import { pool } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";

class LoginLogService {

    async getLoginLogs() {

        const [rows] = await pool.execute(
            `SELECT
                log_id,
                user_id,
                ip_address,
                device_info,
                status,
                created_at
             FROM login_logs
             ORDER BY log_id DESC`
        );

        return rows;
    }

    async createLoginLog(data) {

        const {
            user_id,
            ip_address,
            device_info,
            status
        } = data;

        if (!status) {
            throw new ApiError(
                400,
                "Login status is required"
            );
        }

        const [result] = await pool.execute(
            `INSERT INTO login_logs
                (user_id, ip_address, device_info, status)
             VALUES (?, ?, ?, ?)`,
            [
                user_id ?? null,
                ip_address ?? null,
                device_info ?? null,
                status
            ]
        );

        return {
            log_id: result.insertId,
            user_id: user_id ?? null,
            ip_address: ip_address ?? null,
            device_info: device_info ?? null,
            status
        };
    }
}

export default new LoginLogService();