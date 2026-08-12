import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import ProductService from '../services/product.service.js';

const createProduct = asyncHandler(async (req, res) => {
    const product = await ProductService.createProduct(req.body);
    return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

const getProducts = asyncHandler(async (req, res) => {
    const result = await ProductService.getProducts(req.query);
    return res.status(200).json(new ApiResponse(200, result, "Products retrieved successfully"));
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await ProductService.getProductById(req.params.id);
    return res.status(200).json(new ApiResponse(200, product, "Product retrieved successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
    const product = await ProductService.updateProduct(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
    await ProductService.deleteProduct(req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Product deleted successfully"));
});

// Barcodes
const addBarcode = asyncHandler(async (req, res) => {
    const barcodes = await ProductService.addBarcode(req.params.id, req.body);
    return res.status(201).json(new ApiResponse(201, barcodes, "Barcode added successfully"));
});

const getBarcodes = asyncHandler(async (req, res) => {
    const barcodes = await ProductService.getBarcodes(req.params.id);
    return res.status(200).json(new ApiResponse(200, barcodes, "Barcodes retrieved successfully"));
});

// Images
const addImage = asyncHandler(async (req, res) => {
    const images = await ProductService.addImage(req.params.id, req.body, req.file);
    return res.status(201).json(new ApiResponse(201, images, "Image added successfully"));
});

const getImages = asyncHandler(async (req, res) => {
    const images = await ProductService.getImages(req.params.id);
    return res.status(200).json(new ApiResponse(200, images, "Images retrieved successfully"));
});

export {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addBarcode,
    getBarcodes,
    addImage,
    getImages
};
