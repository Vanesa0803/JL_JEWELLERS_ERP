import { Router } from "express";

import {
    getBarcodeSettings,
    createBarcodeSettings,
    updateBarcodeSettings
} from "./barcode.controller.js";

const router = Router();

router.get("/", getBarcodeSettings);

router.post("/", createBarcodeSettings);

router.put("/", updateBarcodeSettings);

export default router;