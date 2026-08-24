import { pool } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";

class NotificationService {
    async getNotifications() {
        const [rows] = await pool.execute(
            `SELECT
                notification_id,
                setting_name,
                is_enabled,
                created_at
             FROM notification_settings
             ORDER BY notification_id ASC`
        );

        return rows;
    }

    async createNotification(data) {
        const {
            setting_name,
            is_enabled
        } = data;

        if (!setting_name || is_enabled === undefined) {
            throw new ApiError(
                400,
                "Setting name and enabled status are required"
            );
        }

        if (is_enabled !== 0 && is_enabled !== 1 &&
            is_enabled !== true && is_enabled !== false) {
            throw new ApiError(
                400,
                "is_enabled must be true or false"
            );
        }

        const [existing] = await pool.execute(
            `SELECT notification_id
             FROM notification_settings
             WHERE setting_name = ?
             LIMIT 1`,
            [setting_name]
        );

        if (existing.length > 0) {
            throw new ApiError(
                409,
                "Notification setting already exists"
            );
        }

        const [result] = await pool.execute(
            `INSERT INTO notification_settings
                (setting_name, is_enabled)
             VALUES (?, ?)`,
            [
                setting_name,
                is_enabled ? 1 : 0
            ]
        );

        return {
            notification_id: result.insertId,
            setting_name,
            is_enabled: Boolean(is_enabled)
        };
    }

    async updateNotification(id, data) {
        const {
            setting_name,
            is_enabled
        } = data;

        if (!setting_name || is_enabled === undefined) {
            throw new ApiError(
                400,
                "Setting name and enabled status are required"
            );
        }

        if (is_enabled !== 0 && is_enabled !== 1 &&
            is_enabled !== true && is_enabled !== false) {
            throw new ApiError(
                400,
                "is_enabled must be true or false"
            );
        }

        const [existing] = await pool.execute(
            `SELECT notification_id
             FROM notification_settings
             WHERE notification_id = ?
             LIMIT 1`,
            [id]
        );

        if (existing.length === 0) {
            throw new ApiError(
                404,
                "Notification setting not found"
            );
        }

        await pool.execute(
            `UPDATE notification_settings
             SET
                setting_name = ?,
                is_enabled = ?
             WHERE notification_id = ?`,
            [
                setting_name,
                is_enabled ? 1 : 0,
                id
            ]
        );

        const [rows] = await pool.execute(
            `SELECT
                notification_id,
                setting_name,
                is_enabled,
                created_at
             FROM notification_settings
             WHERE notification_id = ?`,
            [id]
        );

        return {
            ...rows[0],
            is_enabled: Boolean(rows[0].is_enabled)
        };
    }

    async deleteNotification(id) {
        const [existing] = await pool.execute(
            `SELECT notification_id
             FROM notification_settings
             WHERE notification_id = ?
             LIMIT 1`,
            [id]
        );

        if (existing.length === 0) {
            throw new ApiError(
                404,
                "Notification setting not found"
            );
        }

        await pool.execute(
            `DELETE FROM notification_settings
             WHERE notification_id = ?`,
            [id]
        );

        return null;
    }
}

export default new NotificationService();