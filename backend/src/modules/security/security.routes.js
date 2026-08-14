import express from "express";

const router = express.Router();

import financialSecurityController from "./security.controller.js";

// Create Financial PIN
router.post(
    "/set-pin",
    financialSecurityController.createFinancialPin
);

// Verify Financial PIN
router.post(
    "/verify-pin",
    financialSecurityController.verifyFinancialPin
);

// Change Financial PIN
router.patch(
    "/change-pin",
    financialSecurityController.changeFinancialPin
);

// Get Financial Security Settings
router.get(
    "/",
    financialSecurityController.getFinancialSecurity
);

// Update Financial Settings
router.patch(
    "/settings",
    financialSecurityController.updateSecuritySettings
);

export default router;