import { Router } from 'express';
import { uploadProductImage } from '../config/multer.js';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addBarcode,
    getBarcodes,
    addImage,
    getImages
} from '../controllers/product.controller.js';
import { getVariantsByProduct, createVariant } from '../controllers/productVariant.controller.js';

const router = Router();

// /api/v1/products

router.route('/')
    .post(createProduct)
    .get(getProducts);

router.route('/:id')
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

// Nested routes for variants
router.route('/:productId/variants')
    .post(createVariant)
    .get(getVariantsByProduct);

// Nested routes for barcodes
router.route('/:id/barcodes')
    .post(addBarcode)
    .get(getBarcodes);

// Nested routes for images
router.route('/:id/images')
    .post(uploadProductImage.single('image_file'), addImage)
    .get(getImages);

export default router;
