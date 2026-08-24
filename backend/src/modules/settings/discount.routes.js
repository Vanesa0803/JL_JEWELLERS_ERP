import { Router } from "express";

import {
    getDiscountSettings,
    createDiscountSettings,
    updateDiscountSettings
} from "./discount.controller.js";

const router = Router();

router.get("/", getDiscountSettings);

router.post("/", createDiscountSettings);

router.put("/", updateDiscountSettings);

export default router;