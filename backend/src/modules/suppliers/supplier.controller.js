import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import SupplierService from './supplier.service.js';

const createSupplier = asyncHandler(async (req, res) => {
    const { supplier_name, mobile } = req.body;
    if (!supplier_name || !mobile) {
        throw new ApiError(400, "Supplier name and mobile are required");
    }

    const supplier = await SupplierService.createSupplier(req.body);
    return res.status(201).json(new ApiResponse(201, supplier, "Supplier created successfully"));
});

const getSuppliers = asyncHandler(async (req, res) => {
    const result = await SupplierService.getSuppliers(req.query);
    return res.status(200).json(new ApiResponse(200, result, "Suppliers retrieved successfully"));
});

const getSupplierById = asyncHandler(async (req, res) => {
    const supplier = await SupplierService.getSupplierById(req.params.id);
    return res.status(200).json(new ApiResponse(200, supplier, "Supplier retrieved successfully"));
});

const updateSupplier = asyncHandler(async (req, res) => {
    const supplier = await SupplierService.updateSupplier(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, supplier, "Supplier updated successfully"));
});

const deleteSupplier = asyncHandler(async (req, res) => {
    await SupplierService.deleteSupplier(req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Supplier deleted successfully"));
});

const activateSupplier = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const supplier = await SupplierService.activateSupplier(req.params.id, status);
    return res.status(200).json(new ApiResponse(200, supplier, `Supplier status updated to ${status}`));
});

export {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
    activateSupplier
};
