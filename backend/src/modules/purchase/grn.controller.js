import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import GrnService from './grn.service.js';

const createGrn = asyncHandler(async (req, res) => {
    const grn = await GrnService.createGrn(req.body);
    return res.status(201).json(new ApiResponse(201, grn, "GRN created successfully"));
});

const getGrns = asyncHandler(async (req, res) => {
    const result = await GrnService.getGrns(req.query);
    return res.status(200).json(new ApiResponse(200, result, "GRNs retrieved successfully"));
});

const getGrnById = asyncHandler(async (req, res) => {
    const grn = await GrnService.getGrnById(req.params.id);
    return res.status(200).json(new ApiResponse(200, grn, "GRN retrieved successfully"));
});

const updateGrnStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const grn = await GrnService.updateGrnStatus(req.params.id, status);
    return res.status(200).json(new ApiResponse(200, grn, "GRN status updated successfully"));
});

const updateGrn = asyncHandler(async (req, res) => {
    const grn = await GrnService.updateGrn(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, grn, "GRN updated successfully"));
});

const deleteGrn = asyncHandler(async (req, res) => {
    await GrnService.deleteGrn(req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "GRN deleted successfully"));
});

export {
    createGrn,
    getGrns,
    getGrnById,
    updateGrnStatus,
    updateGrn,
    deleteGrn
};
