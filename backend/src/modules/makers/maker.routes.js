import express from "express";

const router = express.Router();

import makerController from "./maker.controller.js";

router.post(
    "/",
    makerController.createMaker
);

router.get(
    "/",
    makerController.getAllMakers
);

router.get(
    "/productivity",
    makerController.getMakerProductivity
);

router.get(
    "/performance",
    makerController.getMakerPerformance
);

router.get(
    "/payment-ledger",
    makerController.getMakerPaymentLedger
);

// Dynamic routes ALWAYS come last
router.get(
    "/:id",
    makerController.getMakerById
);

router.put(
    "/:id",
    makerController.updateMaker
);

router.patch(
    "/:id/deactivate",
    makerController.deactivateMaker
);

export default router;