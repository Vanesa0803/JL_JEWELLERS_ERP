import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import NotificationService from "./notification.service.js";

const getNotifications = asyncHandler(async (req, res) => {
    const notifications =
        await NotificationService.getNotifications();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                notifications,
                "Notification settings retrieved successfully"
            )
        );
});

const createNotification = asyncHandler(async (req, res) => {
    const notification =
        await NotificationService.createNotification(req.body);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                notification,
                "Notification setting created successfully"
            )
        );
});

const updateNotification = asyncHandler(async (req, res) => {
    const notification =
        await NotificationService.updateNotification(
            req.params.id,
            req.body
        );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                notification,
                "Notification setting updated successfully"
            )
        );
});

const deleteNotification = asyncHandler(async (req, res) => {
    await NotificationService.deleteNotification(
        req.params.id
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Notification setting deleted successfully"
            )
        );
});

export {
    getNotifications,
    createNotification,
    updateNotification,
    deleteNotification
};