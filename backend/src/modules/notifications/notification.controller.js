import notificationService from "./notification.service.js";


const getNotifications = async (req, res) => {

    try {

        const userId = req.user?.user_id;

        const data =
            await notificationService.getNotifications(userId);

        res.status(200).json({

            success: true,
            data

        });

    } catch (error) {

        res.status(400).json({

            success: false,
            message: error.message

        });

    }

};


const getUnreadNotifications = async (req, res) => {

    try {

        const userId = req.user?.user_id;

        const data =
            await notificationService.getUnreadNotifications(
                userId
            );

        res.status(200).json({

            success: true,
            data

        });

    } catch (error) {

        res.status(400).json({

            success: false,
            message: error.message

        });

    }

};


const getUnreadCount = async (req, res) => {

    try {

        const userId = req.user?.user_id;

        const count =
            await notificationService.getUnreadCount(
                userId
            );

        res.status(200).json({

            success: true,

            data: {
                unread_count: count
            }

        });

    } catch (error) {

        res.status(400).json({

            success: false,
            message: error.message

        });

    }

};


const markAsRead = async (req, res) => {

    try {

        const userId = req.user?.user_id;

        const notificationId =
            Number(req.params.notificationId);

        const data =
            await notificationService.markAsRead(
                notificationId,
                userId
            );

        res.status(200).json({

            success: true,

            message: "Notification marked as read.",
            data

        });

    } catch (error) {

        res.status(400).json({

            success: false,
            message: error.message

        });

    }

};


const markAllAsRead = async (req, res) => {

    try {

        const userId = req.user?.user_id;

        const data =
            await notificationService.markAllAsRead(
                userId
            );

        res.status(200).json({

            success: true,

            message: "All notifications marked as read.",
            data

        });

    } catch (error) {

        res.status(400).json({

            success: false,
            message: error.message

        });

    }

};


const deleteNotification = async (req, res) => {

    try {

        const userId = req.user?.user_id;

        const notificationId =
            Number(req.params.notificationId);

        const data =
            await notificationService.deleteNotification(
                notificationId,
                userId
            );

        res.status(200).json({

            success: true,

            message: "Notification deleted successfully.",
            data

        });

    } catch (error) {

        res.status(400).json({

            success: false,
            message: error.message

        });

    }

};


export {

    getNotifications,
    getUnreadNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification

};


export default {

    getNotifications,
    getUnreadNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification

};