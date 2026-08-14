import express from "express";
const router = express.Router();
import attendanceController from "./attendance.controller.js";

router.post("/check-in", attendanceController.checkIn);
router.post("/check-out", attendanceController.checkOut);
router.get("/", attendanceController.getAttendance);


export default router;
