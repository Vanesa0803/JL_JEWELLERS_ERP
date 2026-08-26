import express from "express";
import notificationController from "./notification.controller.js";

const router = express.Router();

router.get(
    "/",
    notificationController.getNotifications
);

router.get(
    "/unread",
    notificationController.getUnreadNotifications
);

router.get(
    "/count",
    notificationController.getUnreadCount
);

router.patch(
    "/read-all",
    notificationController.markAllAsRead
);

router.patch(
    "/:notificationId/read",
    notificationController.markAsRead
);

router.delete(
    "/:notificationId",
    notificationController.deleteNotification
);

export default router;