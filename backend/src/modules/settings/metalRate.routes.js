import { Router } from "express";

import {
    getMetalRates,
    createMetalRate,
    updateMetalRate
} from "./metalRate.controller.js";

const router = Router();

router.get("/", getMetalRates);

router.post("/", createMetalRate);

router.put("/:id", updateMetalRate);

export default router;