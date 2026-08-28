import api from "./api";

/* =========================
   SCHEME TYPES
========================= */

export const getSchemeTypes = () => {
  return api.get("/gold-schemes/types");
};

export const getSchemeType = (id) => {
  return api.get(`/gold-schemes/types/${id}`);
};

export const createSchemeType = (data) => {
  return api.post("/gold-schemes/types", data);
};

export const updateSchemeType = (id, data) => {
  return api.put(`/gold-schemes/types/${id}`, data);
};

export const deactivateSchemeType = (id) => {
  return api.patch(`/gold-schemes/types/${id}/deactivate`);
};


/* =========================
   ENROLLMENTS
========================= */

export const getEnrollments = () => {
  return api.get("/gold-schemes/enrollments");
};

export const getEnrollment = (id) => {
  return api.get(`/gold-schemes/enrollments/${id}`);
};

export const createEnrollment = (data) => {
  return api.post("/gold-schemes/enrollments", data);
};


/* =========================
   INSTALLMENTS
========================= */

export const payInstallment = (data) => {
  return api.post("/gold-schemes/installments/pay", data);
};

export const getInstallmentHistory = (enrollmentId) => {
  return api.get(
    `/gold-schemes/enrollments/${enrollmentId}/installments`
  );
};

export const getMissedInstallments = () => {
  return api.get("/gold-schemes/installments/missed");
};


/* =========================
   LEDGER
========================= */

export const getSchemeLedger = (enrollmentId) => {
  return api.get(
    `/gold-schemes/enrollments/${enrollmentId}/ledger`
  );
};


/* =========================
   MATURITY
========================= */

export const processSchemeMaturity = (enrollmentId) => {
  return api.post(
    `/gold-schemes/maturity/${enrollmentId}`
  );
};
