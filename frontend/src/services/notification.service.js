import api from "./api.js";

export const getNotifications = () =>
  api.get("/notifications");

export const getUnreadNotifications = () =>
  api.get("/notifications/unread");

export const getUnreadCount = () =>
  api.get("/notifications/count");

export const markAsRead = (notificationId) =>
  api.patch(`/notifications/${notificationId}/read`);

export const markAllAsRead = () =>
  api.patch("/notifications/read-all");

export const deleteNotification = (notificationId) =>
  api.delete(`/notifications/${notificationId}`);
