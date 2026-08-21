import { Router } from "express";

import {
    getGst,
    createGst,
    updateGst
} from "./gst.controller.js";

const router = Router();

router.get("/", getGst);

router.post("/", createGst);

router.put("/", updateGst);

export default router;