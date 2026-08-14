import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import SubcategoryService from './subcategory.service.js';

const createSubcategory = asyncHandler(async (req, res) => {
    const subcategory = await SubcategoryService.createSubcategory(req.body);
    return res.status(201).json(new ApiResponse(201, subcategory, "Subcategory created successfully"));
});

const getSubcategoriesByCategory = asyncHandler(async (req, res) => {
    // We expect this to be mounted under /api/v1/categories/:categoryId/subcategories
    const categoryId = req.params.categoryId;
    const subcategories = await SubcategoryService.getSubcategoriesByCategory(categoryId);
    return res.status(200).json(new ApiResponse(200, subcategories, "Subcategories retrieved successfully"));
});

const getSubcategoryById = asyncHandler(async (req, res) => {
    // Mapped independently or via /api/v1/subcategories/:id
    const subcategory = await SubcategoryService.getSubcategoryById(req.params.id);
    return res.status(200).json(new ApiResponse(200, subcategory, "Subcategory retrieved successfully"));
});

const updateSubcategory = asyncHandler(async (req, res) => {
    const subcategory = await SubcategoryService.updateSubcategory(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, subcategory, "Subcategory updated successfully"));
});

const deleteSubcategory = asyncHandler(async (req, res) => {
    await SubcategoryService.deleteSubcategory(req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Subcategory deleted successfully"));
});

export {
    createSubcategory,
    getSubcategoriesByCategory,
    getSubcategoryById,
    updateSubcategory,
    deleteSubcategory
};
