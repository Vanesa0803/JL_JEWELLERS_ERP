import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import PurchaseReturnService from './purchaseReturn.service.js';

const createReturn = asyncHandler(async (req, res) => {
    const returnData = await PurchaseReturnService.createReturn(req.body);
    return res.status(201).json(new ApiResponse(201, returnData, "Purchase Return created successfully"));
});

const getReturns = asyncHandler(async (req, res) => {
    const result = await PurchaseReturnService.getReturns(req.query);
    return res.status(200).json(new ApiResponse(200, result, "Purchase Returns retrieved successfully"));
});

const getReturnById = asyncHandler(async (req, res) => {
    const returnData = await PurchaseReturnService.getReturnById(req.params.id);
    return res.status(200).json(new ApiResponse(200, returnData, "Purchase Return retrieved successfully"));
});

const updateReturn = asyncHandler(async (req, res) => {
    const returnData = await PurchaseReturnService.updateReturn(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, returnData, "Purchase Return updated successfully"));
});

const deleteReturn = asyncHandler(async (req, res) => {
    await PurchaseReturnService.deleteReturn(req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Purchase Return deleted successfully"));
});

export {
    createReturn,
    getReturns,
    getReturnById,
    updateReturn,
    deleteReturn
};
