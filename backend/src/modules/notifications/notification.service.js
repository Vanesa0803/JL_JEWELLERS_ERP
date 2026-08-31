import notificationModel from "./notification.model.js";

const getNotifications = (userId) => notificationModel.getNotifications(userId);
const getUnreadNotifications = (userId) => notificationModel.getUnreadNotifications(userId);
const getUnreadCount = (userId) => notificationModel.getUnreadCount(userId);
const markAsRead = (notificationId, userId) => notificationModel.markAsRead(notificationId, userId);
const markAllAsRead = (userId) => notificationModel.markAllAsRead(userId);
const deleteNotification = (notificationId, userId) => notificationModel.deleteNotification(notificationId, userId);

export default {
    getNotifications,
    getUnreadNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
};
