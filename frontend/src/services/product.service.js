import api from "./api";

// ===============================
// PRODUCTS
// ===============================

export const getProducts = (params = {}) =>
  api.get("/products", { params });

export const getProductById = (id) =>
  api.get(`/products/${id}`);

export const createProduct = (data) =>
  api.post("/products", data);

export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);

// ===============================
// PRODUCT VARIANTS
// ===============================

export const getProductVariants = (productId) =>
  api.get(`/products/${productId}/variants`);

export const createProductVariant = (productId, data) =>
  api.post(`/products/${productId}/variants`, data);

// ===============================
// MASTER DATA
// ===============================

export const getCategories = () =>
  api.get("/categories");

export const getMetalTypes = () =>
  api.get("/metal-types");

export const getPurities = () =>
  api.get("/purity");