import express from "express";

const router = express.Router();

import cashBookController from "./cashbook.controller.js";

router.get(
    "/statement",
    cashBookController.getCashBookStatement
);

export default router;