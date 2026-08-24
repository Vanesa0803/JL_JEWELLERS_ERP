import { Router } from "express";

import securityController from "./security.controller.js";

const router = Router();

/* Create PIN */
router.post(
    "/set-pin",
    securityController.createFinancialPin
);

/* Verify PIN */
router.post(
    "/verify-pin",
    securityController.verifyFinancialPin
);

/* Change PIN */
router.patch(
    "/change-pin",
    securityController.changeFinancialPin
);

/* Get security information */
router.get(
    "/",
    securityController.getFinancialSecurity
);

/* Update security settings */
router.patch(
    "/settings",
    securityController.updateSecuritySettings
);

export default router;