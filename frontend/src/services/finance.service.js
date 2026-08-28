import api from "./api";

export const getFinanceDashboard = () => {
  return api.get("/finance/dashboard");
};

export const getProfitLossSummary = () => {
  return api.get("/finance/summary/profit-loss");
};

export const getCashFlowSummary = () => {
  return api.get("/finance/summary/cash-flow");
};

export const getBankAccounts = () => {
  return api.get("/finance/bank-accounts");
};

export const getOutstandingPayables = () => {
  return api.get("/finance/outstanding-payables");
};

export const getGSTSummary = () => {
  return api.get("/finance/gst-summary");
};
