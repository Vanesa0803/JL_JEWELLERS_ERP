import { Router } from "express";

import {
    getCompany,
    createCompany,
    updateCompany
} from "./company.controller.js";

const router = Router();

router.get("/", getCompany);

router.post("/", createCompany);

router.put("/", updateCompany);

export default router;