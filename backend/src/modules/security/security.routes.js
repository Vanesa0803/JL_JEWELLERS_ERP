import express from "express";
import auth from "../../middleware/auth.js";

const router = express.Router();

import financialSecurityController from "./security.controller.js";

// Create Financial PIN
router.post(
    "/set-pin",
    auth,
    financialSecurityController.createFinancialPin
);

// Verify Financial PIN
router.post(
    "/verify-pin",
    auth,
    financialSecurityController.verifyFinancialPin
);

// Change Financial PIN
router.patch(
    "/change-pin",
    auth,
    financialSecurityController.changeFinancialPin
);

// Get Financial Security Settings
router.get(
    "/",
    auth,
    financialSecurityController.getFinancialSecurity
);

// Update Financial Settings
router.patch(
    "/settings",
    auth,
    financialSecurityController.updateSecuritySettings
);

export default router;