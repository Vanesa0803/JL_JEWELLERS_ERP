import { Router } from "express";

import {
    getInvoiceSettings,
    createInvoiceSettings,
    updateInvoiceSettings
} from "./invoice.controller.js";

const router = Router();

router.get("/", getInvoiceSettings);

router.post("/", createInvoiceSettings);

router.put("/", updateInvoiceSettings);

export default router;