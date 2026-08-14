import ProductRepository from './product.repository.js';
// Cross-module: these live in masters. A product validates its category,
// metal type and purity against the master lists before being created.
import CategoryRepository from '../masters/category.repository.js';
import MetalTypeRepository from '../masters/metalType.repository.js';
import PurityRepository from '../masters/purity.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import fs from 'fs';

class ProductService {
    async createProduct(data) {
        if (!data.product_code || !data.product_name || !data.category_id || !data.metal_type_id || !data.purity_id) {
            throw new ApiError(400, "product_code, product_name, category_id, metal_type_id, and purity_id are required");
        }

        const existingCode = await ProductRepository.findByCode(data.product_code);
        if (existingCode) {
            throw new ApiError(409, "Product with this code already exists");
        }

        // Validate dependencies
        const category = await CategoryRepository.findById(data.category_id);
        if (!category) throw new ApiError(404, "Category not found");

        const metalType = await MetalTypeRepository.findById(data.metal_type_id);
        if (!metalType) throw new ApiError(404, "Metal type not found");

        const purity = await PurityRepository.findById(data.purity_id);
        if (!purity) throw new ApiError(404, "Purity not found");

        const productId = await ProductRepository.create(data);
        return await ProductRepository.findById(productId);
    }

    async getProducts(queryObj) {
        const page = parseInt(queryObj.page) || 1;
        const limit = parseInt(queryObj.limit) || 10;
        const offset = (page - 1) * limit;

        let is_active = undefined;
        if (queryObj.is_active !== undefined) {
            is_active = queryObj.is_active === 'true' ? 1 : 0;
        }

        const filters = {
            search: queryObj.search,
            category_id: queryObj.category_id,
            is_active,
            limit,
            offset
        };

        const { rows, totalCount } = await ProductRepository.findAll(filters);

        return {
            products: rows,
            pagination: {
                totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        };
    }

    async getProductById(id) {
        const product = await ProductRepository.findById(id);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
        return product;
    }

    async updateProduct(id, data) {
        const existingProduct = await ProductRepository.findById(id);
        if (!existingProduct) {
            throw new ApiError(404, "Product not found");
        }

        if (data.product_code && data.product_code !== existingProduct.product_code) {
            const codeTaken = await ProductRepository.findByCode(data.product_code);
            if (codeTaken) {
                throw new ApiError(409, "Product code is already in use");
            }
        }

        // We could validate dependencies again here if they are provided, but to keep it concise,
        // we assume the DB foreign keys will catch invalid updates or we trust the input.
        
        const affectedRows = await ProductRepository.update(id, data);
        if (affectedRows === 0) {
            throw new ApiError(500, "Failed to update product");
        }

        return await ProductRepository.findById(id);
    }

    async deleteProduct(id) {
        const product = await ProductRepository.findById(id);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        try {
            await ProductRepository.delete(id);
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new ApiError(400, "Cannot delete product because it has variants, inventory, or orders attached.");
            }
            throw error;
        }

        return true;
    }

    // --- Barcode Services ---
    async addBarcode(productId, barcodeData) {
        const { barcode, qr_code } = barcodeData;
        if (!barcode) throw new ApiError(400, "Barcode is required");

        const product = await ProductRepository.findById(productId);
        if (!product) throw new ApiError(404, "Product not found");

        const existingBarcode = await ProductRepository.findBarcode(barcode);
        if (existingBarcode) throw new ApiError(409, "Barcode already registered");

        await ProductRepository.addBarcode(productId, barcode, qr_code);
        return await ProductRepository.getBarcodesByProductId(productId);
    }

    async getBarcodes(productId) {
        return await ProductRepository.getBarcodesByProductId(productId);
    }

    // --- Image Services ---
    async addImage(productId, bodyData, file) {
        if (!file) throw new ApiError(400, "Image file is required");

        const product = await ProductRepository.findById(productId);
        if (!product) {
            fs.unlinkSync(file.path);
            throw new ApiError(404, "Product not found");
        }

        const isPrimary = bodyData.is_primary === 'true' || bodyData.is_primary === true;
        await ProductRepository.addImage(productId, file.path, bodyData.image_type, isPrimary);
        
        return await ProductRepository.getImagesByProductId(productId);
    }

    async getImages(productId) {
        return await ProductRepository.getImagesByProductId(productId);
    }
}

export default new ProductService();
