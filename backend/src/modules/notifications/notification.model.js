import db from "../../config/db.js";

/**
 * Create a notification
 */
const createNotification = ({
    user_id,
    notification_type,
    title,
    message
}) => {

    return new Promise((resolve, reject) => {

        const query = `
            INSERT INTO notifications
            (
                user_id,
                notification_type,
                title,
                message
            )
            VALUES (?, ?, ?, ?)
        `;

        const values = [
            user_id,
            notification_type,
            title,
            message
        ];

        db.query(query, values, (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve({
                notification_id: result.insertId,
                user_id,
                notification_type,
                title,
                message
            });

        });

    });

};


/**
 * Get notifications for a user
 */
const getNotifications = (userId) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT
                notification_id,
                user_id,
                notification_type,
                title,
                message,
                is_read,
                created_at
            FROM notifications
            WHERE user_id = ?
            ORDER BY created_at DESC
        `;

        db.query(
            query,
            [userId],
            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result);

            }
        );

    });

};


/**
 * Get unread notifications
 */
const getUnreadNotifications = (userId) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT
                notification_id,
                user_id,
                notification_type,
                title,
                message,
                is_read,
                created_at
            FROM notifications
            WHERE user_id = ?
            AND is_read = 0
            ORDER BY created_at DESC
        `;

        db.query(
            query,
            [userId],
            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result);

            }
        );

    });

};


/**
 * Get unread notification count
 */
const getUnreadCount = (userId) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT COUNT(*) AS unread_count
            FROM notifications
            WHERE user_id = ?
            AND is_read = 0
        `;

        db.query(
            query,
            [userId],
            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result[0].unread_count);

            }
        );

    });

};


/**
 * Mark one notification as read
 */
const markAsRead = (notificationId, userId) => {

    return new Promise((resolve, reject) => {

        const query = `
            UPDATE notifications
            SET is_read = 1
            WHERE notification_id = ?
            AND user_id = ?
        `;

        db.query(
            query,
            [notificationId, userId],
            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result);

            }
        );

    });

};


/**
 * Mark all notifications as read
 */
const markAllAsRead = (userId) => {

    return new Promise((resolve, reject) => {

        const query = `
            UPDATE notifications
            SET is_read = 1
            WHERE user_id = ?
            AND is_read = 0
        `;

        db.query(
            query,
            [userId],
            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result);

            }
        );

    });

};


/**
 * Delete one notification
 */
const deleteNotification = (notificationId, userId) => {

    return new Promise((resolve, reject) => {

        const query = `
            DELETE FROM notifications
            WHERE notification_id = ?
            AND user_id = ?
        `;

        db.query(
            query,
            [notificationId, userId],
            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result);

            }
        );

    });

};


/**
 * Check whether a notification type is enabled
 */
const isNotificationEnabled = (settingName) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT is_enabled
            FROM notification_settings
            WHERE setting_name = ?
            LIMIT 1
        `;

        db.query(
            query,
            [settingName],
            (err, result) => {

                if (err) {
                    return reject(err);
                }

                if (result.length === 0) {
                    return resolve(true);
                }

                resolve(Boolean(result[0].is_enabled));

            }
        );

    });

};


export {
    createNotification,
    getNotifications,
    getUnreadNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isNotificationEnabled
};


export default {
    createNotification,
    getNotifications,
    getUnreadNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isNotificationEnabled
};