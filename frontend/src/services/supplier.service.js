import api from "./api";

/* =========================
   SUPPLIERS
========================= */

// Get all suppliers
export const getSuppliers = () => {
  return api.get("/suppliers");
};

// Get supplier by ID
export const getSupplierById = (id) => {
  return api.get(`/suppliers/${id}`);
};

// Create supplier
export const createSupplier = (data) => {
  return api.post("/suppliers", data);
};

// Update supplier
export const updateSupplier = (id, data) => {
  return api.put(`/suppliers/${id}`, data);
};

// Delete supplier
export const deleteSupplier = (id) => {
  return api.delete(`/suppliers/${id}`);
};

// Activate supplier
export const activateSupplier = (id) => {
  return api.patch(`/suppliers/${id}/activate`);
};