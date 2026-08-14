import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import SupplierPaymentService from './supplierPayment.service.js';

const createPayment = asyncHandler(async (req, res) => {
    const payment = await SupplierPaymentService.createPayment(req.body);
    return res.status(201).json(new ApiResponse(201, payment, "Supplier payment created successfully"));
});

const getPayments = asyncHandler(async (req, res) => {
    const result = await SupplierPaymentService.getPayments(req.query);
    return res.status(200).json(new ApiResponse(200, result, "Supplier payments retrieved successfully"));
});

const getPaymentById = asyncHandler(async (req, res) => {
    const payment = await SupplierPaymentService.getPaymentById(req.params.id);
    return res.status(200).json(new ApiResponse(200, payment, "Supplier payment retrieved successfully"));
});

const updatePayment = asyncHandler(async (req, res) => {
    const payment = await SupplierPaymentService.updatePayment(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, payment, "Supplier payment updated successfully"));
});

const deletePayment = asyncHandler(async (req, res) => {
    await SupplierPaymentService.deletePayment(req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Supplier payment deleted successfully"));
});

export {
    createPayment,
    getPayments,
    getPaymentById,
    updatePayment,
    deletePayment
};
