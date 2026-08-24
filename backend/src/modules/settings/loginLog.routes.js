import { Router } from "express";

import {
    getLoginLogs,
    createLoginLog
} from "./loginLog.controller.js";

const router = Router();

router.get("/", getLoginLogs);

router.post("/", createLoginLog);

export default router;