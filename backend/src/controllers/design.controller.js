import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import DesignService from '../services/design.service.js';

const createDesign = asyncHandler(async (req, res) => {
    const design = await DesignService.createDesign(req.body);
    return res.status(201).json(new ApiResponse(201, design, "Design created successfully"));
});

const getAllDesigns = asyncHandler(async (req, res) => {
    const designs = await DesignService.getAllDesigns();
    return res.status(200).json(new ApiResponse(200, designs, "Designs retrieved successfully"));
});

const getDesignById = asyncHandler(async (req, res) => {
    const design = await DesignService.getDesignById(req.params.id);
    return res.status(200).json(new ApiResponse(200, design, "Design retrieved successfully"));
});

const updateDesign = asyncHandler(async (req, res) => {
    const design = await DesignService.updateDesign(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, design, "Design updated successfully"));
});

const deleteDesign = asyncHandler(async (req, res) => {
    await DesignService.deleteDesign(req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Design deleted successfully"));
});

export {
    createDesign,
    getAllDesigns,
    getDesignById,
    updateDesign,
    deleteDesign
};
