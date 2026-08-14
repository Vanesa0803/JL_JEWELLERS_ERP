import express from "express";

const router = express.Router();

import goldSchemeController from "./scheme.controller.js";

router.post(
    "/types",
    goldSchemeController.createSchemeType
);

router.post(
    "/enrollments",
    goldSchemeController.createEnrollment
);

router.post(
    "/installments/pay",
    goldSchemeController.payInstallment
);

router.post(
    "/maturity/:enrollmentId",
    goldSchemeController.processSchemeMaturity
);

router.get(
    "/types",
    goldSchemeController.getAllSchemeTypes
);

router.get(
    "/types/:id",
    goldSchemeController.getSchemeTypeById
);

router.get(
    "/enrollments",
    goldSchemeController.getAllEnrollments
);

router.get(
    "/enrollments/:id",
    goldSchemeController.getEnrollmentById
);

router.get(
    "/enrollments/:id/installments",
    goldSchemeController.getInstallmentHistory
);

router.get(
    "/enrollments/:id/ledger",
    goldSchemeController.getLedgerHistory
);

router.get(
    "/installments/missed",
    goldSchemeController.getMissedInstallments
);

router.put(
    "/types/:id",
    goldSchemeController.updateSchemeType
);

router.patch(
    "/types/:id/deactivate",
    goldSchemeController.deactivateSchemeType
);

export default router;