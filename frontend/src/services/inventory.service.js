import api from "./api";

export const getCurrentStock = (params = {}) =>
  api.get("/inventory", { params });

export const getLowStock = (params = {}) =>
  api.get("/inventory/low-stock", { params });

export const getStockMovements = (params = {}) =>
  api.get("/inventory/movements", { params });

export const stockIn = (data) =>
  api.post("/inventory/in", data);

export const stockOut = (data) =>
  api.post("/inventory/out", data);

export const adjustStock = (data) =>
  api.post("/inventory/adjust", data);


// Analytics

export const getGoldStock = () =>
  api.get("/inventory-analytics/gold");

export const getSilverStock = () =>
  api.get("/inventory-analytics/silver");

export const getPlatinumStock = () =>
  api.get("/inventory-analytics/platinum");

export const getDiamondStock = () =>
  api.get("/inventory-analytics/diamond");

export const getStoneStock = () =>
  api.get("/inventory-analytics/stones");

export const getDeadStock = () =>
  api.get("/inventory-analytics/dead-stock");

export const getFastMoving = () =>
  api.get("/inventory-analytics/fast-moving");

export const getSlowMoving = () =>
  api.get("/inventory-analytics/slow-moving");

export const getAnalyticsLowStock = () =>
  api.get("/inventory-analytics/low-stock");

export const getOverstock = () =>
  api.get("/inventory-analytics/overstock");

export const getStockAging = () =>
  api.get("/inventory-analytics/stock-aging");
