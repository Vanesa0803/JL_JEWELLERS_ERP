import api from "./api";

// =========================================================
// COMPANY
// =========================================================

export const getCompanySettings = () => {
  return api.get("/settings/company");
};

export const createCompanySettings = (data) => {
  return api.post("/settings/company", data);
};

export const updateCompanySettings = (data) => {
  return api.put("/settings/company", data);
};


// =========================================================
// GST
// =========================================================

export const getGSTSettings = () => {
  return api.get("/settings/gst");
};

export const createGSTSettings = (data) => {
  return api.post("/settings/gst", data);
};

export const updateGSTSettings = (data) => {
  return api.put("/settings/gst", data);
};


// =========================================================
// INVOICE
// =========================================================

export const getInvoiceSettings = () => {
  return api.get("/settings/invoice");
};

export const createInvoiceSettings = (data) => {
  return api.post("/settings/invoice", data);
};

export const updateInvoiceSettings = (data) => {
  return api.put("/settings/invoice", data);
};


// =========================================================
// BARCODE
// =========================================================

export const getBarcodeSettings = () => {
  return api.get("/settings/barcode");
};

export const createBarcodeSettings = (data) => {
  return api.post("/settings/barcode", data);
};

export const updateBarcodeSettings = (data) => {
  return api.put("/settings/barcode", data);
};


// =========================================================
// METAL RATES
// =========================================================

export const getMetalRate = (metalType) => {
  return api.get(`/metal-rates/${metalType}`);
};

export const updateMetalRate = (data) => {
  return api.post("/metal-rates/update", data);
};

// =========================================================
// TAX
// =========================================================

export const getTaxSettings = () => {
  return api.get("/settings/tax");
};

export const createTaxSetting = (data) => {
  return api.post("/settings/tax", data);
};

export const updateTaxSetting = (id, data) => {
  return api.put(`/settings/tax/${id}`, data);
};


// =========================================================
// DISCOUNT
// =========================================================

export const getDiscountSettings = () => {
  return api.get("/settings/discount");
};

export const createDiscountSettings = (data) => {
  return api.post("/settings/discount", data);
};

export const updateDiscountSettings = (data) => {
  return api.put("/settings/discount", data);
};


// =========================================================
// NOTIFICATIONS
// =========================================================

export const getNotificationSettings = () => {
  return api.get("/settings/notifications");
};

export const createNotificationSetting = (data) => {
  return api.post("/settings/notifications", data);
};

export const updateNotificationSetting = (id, data) => {
  return api.put(`/settings/notifications/${id}`, data);
};

export const deleteNotificationSetting = (id) => {
  return api.delete(`/settings/notifications/${id}`);
};


// =========================================================
// LOGIN LOGS
// =========================================================

export const getLoginLogs = () => {
  return api.get("/settings/login-logs");
};

export const createLoginLog = (data) => {
  return api.post("/settings/login-logs", data);
};


// =========================================================
// ACTIVITY LOGS
// =========================================================

export const getActivityLogs = () => {
  return api.get("/settings/activity-logs");
};

export const createActivityLog = (data) => {
  return api.post("/settings/activity-logs", data);
};


// =========================================================
// AUDIT LOGS
// =========================================================

export const getAuditLogs = () => {
  return api.get("/settings/audit-logs");
};

export const createAuditLog = (data) => {
  return api.post("/settings/audit-logs", data);
};


// =========================================================
// ERROR LOGS
// =========================================================

export const getErrorLogs = () => {
  return api.get("/settings/error-logs");
};

export const createErrorLog = (data) => {
  return api.post("/settings/error-logs", data);
};


// =========================================================
// BACKUP
// =========================================================

export const createManualBackup = () => {
  return api.post("/settings/backup/manual");
};

export const createAutomaticBackup = () => {
  return api.post("/settings/backup/automatic");
};

export const getBackupHistory = () => {
  return api.get("/settings/backup/history");
};

export const getBackupById = (id) => {
  return api.get(`/settings/backup/${id}`);
};

export const restoreBackup = (id) => {
  return api.post(`/settings/backup/${id}/restore`);
};