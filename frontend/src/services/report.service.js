import api from "./api";

// Reports
export const getSalesReport = (params = {}) =>
  api.get("/reports/sales", { params });

export const getGSTReport = (params = {}) =>
  api.get("/reports/gst", { params });

export const getCustomerReport = (params = {}) =>
  api.get("/reports/customer", { params });

export const getLedgerReport = (params = {}) =>
  api.get("/reports/ledger", { params });

export const getPaymentReport = (params = {}) =>
  api.get("/reports/payment", { params });

export const getInventoryReport = (params = {}) =>
  api.get("/reports/inventory", { params });

// Analytics
export const getSalesTarget = () =>
  api.get("/analytics/sales-target");

export const getMonthlyRevenue = () =>
  api.get("/analytics/monthly-revenue");

export const getYearlyRevenue = () =>
  api.get("/analytics/yearly-revenue");

export const getRevenueComparison = () =>
  api.get("/analytics/revenue-comparison");

export const getProfitTrends = () =>
  api.get("/analytics/profit-trends");

export const getCustomerAnalytics = () =>
  api.get("/analytics/customer-analytics");

export const getInventoryAnalytics = () =>
  api.get("/analytics/inventory-analytics");

export const getFinancialAnalytics = () =>
  api.get("/analytics/financial-analytics");

// Exports
export const exportReportPDF = (report, params = {}) =>
  api.get("/export/pdf", {
    params: { report, ...params },
    responseType: "blob",
  });

export const exportReportExcel = (report, params = {}) =>
  api.get("/export/excel", {
    params: { report, ...params },
    responseType: "blob",
  });

export const exportReportCSV = (report, params = {}) =>
  api.get("/export/csv", {
    params: { report, ...params },
    responseType: "blob",
  });
