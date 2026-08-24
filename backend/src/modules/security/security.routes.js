import { Router } from "express";
import auth from "../../middleware/auth.js";

import securityController from "./security.controller.js";

const router = Router();

/* Create PIN */
router.post(
    "/set-pin",
    auth,
    securityController.createFinancialPin
);

/* Verify PIN */
router.post(
    "/verify-pin",
    auth,
    securityController.verifyFinancialPin
);

/* Change PIN */
router.patch(
    "/change-pin",
    auth,
    securityController.changeFinancialPin
);

/* Get security information */
router.get(
    "/",
    auth,
    securityController.getFinancialSecurity
);

/* Update security settings */
router.patch(
    "/settings",
    auth,
    securityController.updateSecuritySettings
);

export default router;
