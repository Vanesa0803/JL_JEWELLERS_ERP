import { Router } from "express";

import {
    getActivityLogs,
    createActivityLog
} from "./activityLog.controller.js";

const router = Router();

router.get("/", getActivityLogs);

router.post("/", createActivityLog);

export default router;