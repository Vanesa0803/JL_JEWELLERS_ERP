import express from "express";

const router = express.Router();

import exportController from "./export.controller.js";

router.get("/pdf", exportController.exportPDF);

router.get("/excel", exportController.exportExcel);

router.get("/csv", exportController.exportCSV);

export default router;