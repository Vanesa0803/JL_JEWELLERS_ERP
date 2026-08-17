// services/api is now the ONLY axios instance in the app (S3-9).
//
// This file used to import ./axios, a second instance that attached no auth
// token and targeted bare /api. Once every route requires a token (S1-3),
// anything built on that instance would have started returning 401 — so the
// duplicate is gone rather than left as a trap for whoever used it next.
import api from "../services/api";

export const createBill = async (billData) => {
    const response = await api.post("/bills", billData);
    return response.data;
};

export const getAllBills = async () => {
    const response = await api.get("/bills");
    return response.data;
};

export const getBillById = async (billId) => {
    const response = await api.get(`/bills/${billId}`);
    return response.data;
};

export const updateBill = async (billId, billData) => {
    const response = await api.put(`/bills/${billId}`, billData);
    return response.data;
};

export const updateBillStatus = async (
    billId,
    billStatus,
    paymentStatus
) => {
    const response = await api.put(
        `/bills/${billId}/status`,
        {
            bill_status: billStatus,
            payment_status: paymentStatus
        }
    );

    return response.data;
};

export const cancelBill = async (billId, financialPin) => {
    const response = await api.put(
        `/bills/${billId}/cancel`,
        {
            financial_pin: financialPin
        }
    );

    return response.data;
};

export const deleteBill = async (billId, deletedBy) => {
    const response = await api.delete(
        `/bills/${billId}`,
        {
            data: {
                deleted_by: deletedBy
            }
        }
    );

    return response.data;
};

export const getBillHistory = async (billId) => {
    const response = await api.get(
        `/bills/${billId}/history`
    );

    return response.data;
};

export const searchBills = async (params) => {
    const response = await api.get(
        "/bills/search",
        {
            params
        }
    );

    return response.data;
};

export const printInvoice = async (billId) => {
    const response = await api.get(
        `/bills/${billId}/print`
    );

    return response.data;
};