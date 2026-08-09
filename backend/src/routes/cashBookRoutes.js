const express = require("express");

const router = express.Router();

const cashBookController =
require("../controllers/cashBookController");

router.get(
    "/statement",
    cashBookController.getCashBookStatement
);

module.exports = router;