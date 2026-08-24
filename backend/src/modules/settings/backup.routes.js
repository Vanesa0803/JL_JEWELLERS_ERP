import { Router } from "express";

import {
    createManualBackup,
    createAutomaticBackup,
    getBackupHistory,
    getBackupById,
    restoreBackup
} from "./backup.controller.js";

const router = Router();

router.post(
    "/manual",
    createManualBackup
);

router.post(
    "/automatic",
    createAutomaticBackup
);

router.get(
    "/history",
    getBackupHistory
);

router.get(
    "/:id",
    getBackupById
);

router.post(
    "/:id/restore",
    restoreBackup
);

export default router;