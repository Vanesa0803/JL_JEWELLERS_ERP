const express = require("express");

const router = express.Router();

const exportController =
require("../controllers/exportController.cjs");

router.get("/pdf", exportController.exportPDF);

router.get("/excel", exportController.exportExcel);

router.get("/csv", exportController.exportCSV);

module.exports = router;