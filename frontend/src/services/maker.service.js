import api from "./api";

// ===============================
// MAKERS / KARIGARS
// ===============================

export const getMakers = () =>
  api.get("/makers");

export const getMakerById = (id) =>
  api.get(`/makers/${id}`);

export const createMaker = (data) =>
  api.post("/makers", data);

export const updateMaker = (id, data) =>
  api.put(`/makers/${id}`, data);

export const deactivateMaker = (id) =>
  api.patch(`/makers/${id}/deactivate`);

// ===============================
// MAKER ANALYTICS
// ===============================

export const getMakerProductivity = () =>
  api.get("/makers/productivity");

export const getMakerPerformance = () =>
  api.get("/makers/performance");

export const getMakerPaymentLedger = () =>
  api.get("/makers/payment-ledger");

// ===============================
// MAKER ASSIGNMENTS
// ===============================

export const createMakerAssignment = (data) =>
  api.post("/maker-assignments", data);

export const getMakerAssignments = () =>
  api.get("/maker-assignments");

export const getPendingAssignments = () =>
  api.get("/maker-assignments/pending");

export const getDelayedAssignments = () =>
  api.get("/maker-assignments/delayed");

export const updateAssignmentStatus = (id, status) =>
  api.patch(`/maker-assignments/${id}/status`, {
    assignment_status: status,
  });