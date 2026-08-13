const express = require("express");

const router = express.Router();

const cashBookController =
require("../controllers/cashBookController.cjs");

router.get(
    "/statement",
    cashBookController.getCashBookStatement
);

module.exports = router;