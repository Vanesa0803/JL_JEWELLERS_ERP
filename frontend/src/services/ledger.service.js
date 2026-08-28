import api from "./api";

/* =========================
   CUSTOMER LEDGER
========================= */

// Get all ledger entries for a customer
export const getCustomerLedger = (customerId) => {
  return api.get(`/ledger/${customerId}`);
};

// Get formatted ledger statement
export const getLedgerStatement = (customerId) => {
  return api.get(`/ledger/${customerId}/statement`);
};

// Get customer's outstanding balance
export const getOutstandingBalance = (customerId) => {
  return api.get(`/ledger/${customerId}/outstanding`);
};

// Create a customer ledger entry
export const createLedgerEntry = (data) => {
  return api.post("/ledger", data);
};


/* =========================
   SUPPLIER LEDGER
========================= */

// Get all ledger entries for a supplier
export const getSupplierLedger = (supplierId) => {
  return api.get(`/ledger/supplier/${supplierId}`);
};

// Get supplier's outstanding balance
export const getSupplierOutstandingBalance = (supplierId) => {
  return api.get(
    `/ledger/supplier/${supplierId}/outstanding`
  );
};

// Create a supplier ledger entry
export const createSupplierLedgerEntry = (data) => {
  return api.post("/ledger/supplier", data);
};