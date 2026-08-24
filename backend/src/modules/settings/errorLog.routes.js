import { Router } from "express";

import {
    getErrorLogs,
    createErrorLog
} from "./errorLog.controller.js";

const router = Router();

router.get("/", getErrorLogs);

router.post("/", createErrorLog);

export default router;