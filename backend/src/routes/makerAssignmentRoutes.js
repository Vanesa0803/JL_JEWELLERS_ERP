const express = require("express");

const router = express.Router();

const makerAssignmentController =
require("../controllers/makerAssignmentController");

router.post(

    "/",

    makerAssignmentController.createAssignment

);

router.get(

    "/",

    makerAssignmentController.getAllAssignments

);

router.get(

    "/pending",

    makerAssignmentController.getPendingAssignments

);

router.get(

    "/delayed",

    makerAssignmentController.getDelayedAssignments

);

router.patch(

    "/:id/status",

    makerAssignmentController.updateAssignmentStatus

);

module.exports = router;