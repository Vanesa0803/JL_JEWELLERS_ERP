import express from "express";
const router = express.Router();

import verifyFinancialPin from "../security/verifyFinancialPin.js";
import metalRateController from "./metalRate.controller.js";

router.get(
    "/:metal_type",
    metalRateController.getLatestRate
);

router.post(
    "/update",
    metalRateController.updateMetalRate
);

export default router;