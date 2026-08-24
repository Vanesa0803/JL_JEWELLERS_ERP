import { Router } from "express";

import {
    getTaxSettings,
    createTaxSetting,
    updateTaxSetting
} from "./tax.controller.js";

const router = Router();

router.get("/", getTaxSettings);

router.post("/", createTaxSetting);

router.put("/:id", updateTaxSetting);

export default router;