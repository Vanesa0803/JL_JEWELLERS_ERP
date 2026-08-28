import notificationModel from "./notification.model.js";


const createNotification = async ({
    user_id,
    notification_type,
    title,
    message
}) => {

    if (!user_id) {
        throw new Error("User ID is required.");
    }

    if (!notification_type) {
        throw new Error("Notification type is required.");
    }

    if (!title) {
        throw new Error("Notification title is required.");
    }

    if (!message) {
        throw new Error("Notification message is required.");
    }

    const enabled =
        await notificationModel.isNotificationEnabled(
            notification_type
        );

    if (!enabled) {
        return {
            skipped: true,
            message: "This notification type is disabled."
        };
    }

    return await notificationModel.createNotification({
        user_id,
        notification_type,
        title,
        message
    });

};


const getNotifications = async (userId) => {

    if (!userId) {
        throw new Error("User ID is required.");
    }

    return await notificationModel.getNotifications(userId);

};


const getUnreadNotifications = async (userId) => {

    if (!userId) {
        throw new Error("User ID is required.");
    }

    return await notificationModel.getUnreadNotifications(userId);

};


const getUnreadCount = async (userId) => {

    if (!userId) {
        throw new Error("User ID is required.");
    }

    const count =
        await notificationModel.getUnreadCount(userId);

    return Number(count);

};


const markAsRead = async (
    notificationId,
    userId
) => {

    if (!notificationId) {
        throw new Error("Notification ID is required.");
    }

    if (!userId) {
        throw new Error("User ID is required.");
    }

    const result =
        await notificationModel.markAsRead(
            notificationId,
            userId
        );

    if (result.affectedRows === 0) {
        throw new Error(
            "Notification not found or does not belong to this user."
        );
    }

    return {
        notification_id: Number(notificationId),
        is_read: true
    };

};


const markAllAsRead = async (userId) => {

    if (!userId) {
        throw new Error("User ID is required.");
    }

    const result =
        await notificationModel.markAllAsRead(userId);

    return {
        updated_count: result.affectedRows
    };

};


const deleteNotification = async (
    notificationId,
    userId
) => {

    if (!notificationId) {
        throw new Error("Notification ID is required.");
    }

    if (!userId) {
        throw new Error("User ID is required.");
    }

    const result =
        await notificationModel.deleteNotification(
            notificationId,
            userId
        );

    if (result.affectedRows === 0) {
        throw new Error(
            "Notification not found or does not belong to this user."
        );
    }

    return {
        notification_id: Number(notificationId),
        deleted: true
    };

};


export {
    createNotification,
    getNotifications,
    getUnreadNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
};


export default {
    createNotification,
    getNotifications,
    getUnreadNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
};