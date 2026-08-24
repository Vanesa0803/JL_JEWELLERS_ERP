import { Router } from "express";

import {
    getNotifications,
    createNotification,
    updateNotification,
    deleteNotification
} from "./notification.controller.js";

const router = Router();

router.get("/", getNotifications);

router.post("/", createNotification);

router.put("/:id", updateNotification);

router.delete("/:id", deleteNotification);

export default router;