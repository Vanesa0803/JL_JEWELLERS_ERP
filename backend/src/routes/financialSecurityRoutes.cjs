const express = require("express");

const router = express.Router();

const financialSecurityController =
require("../controllers/financialSecurityController.cjs");

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

module.exports = router;