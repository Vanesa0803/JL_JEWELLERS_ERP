import api from "./api";

export const getAttendance = () =>
  api.get("/attendance");

export const checkIn = (employee_id) =>
  api.post("/attendance/check-in", {
    employee_id,
  });

export const checkOut = (employee_id) =>
  api.post("/attendance/check-out", {
    employee_id,
  });