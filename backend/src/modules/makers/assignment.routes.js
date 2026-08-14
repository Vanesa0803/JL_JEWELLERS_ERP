import express from "express";

const router = express.Router();

import makerAssignmentController from "./assignment.controller.js";

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

export default router;