import ProductVariantRepository from '../repositories/productVariant.repository.js';
import ProductRepository from '../repositories/product.repository.js';
import { ApiError } from '../utils/ApiError.js';

class ProductVariantService {
    async createVariant(data) {
        if (!data.product_id || !data.variant_code) {
            throw new ApiError(400, "product_id and variant_code are required");
        }

        const product = await ProductRepository.findById(data.product_id);
        if (!product) throw new ApiError(404, "Parent product not found");

        const existingCode = await ProductVariantRepository.findByCode(data.variant_code);
        if (existingCode) {
            throw new ApiError(409, "Variant with this code already exists");
        }

        const variantId = await ProductVariantRepository.create(data);
        return await ProductVariantRepository.findById(variantId);
    }

    async getVariantsByProduct(productId) {
        const product = await ProductRepository.findById(productId);
        if (!product) throw new ApiError(404, "Parent product not found");

        return await ProductVariantRepository.findAllByProductId(productId);
    }

    async getVariantById(id) {
        const variant = await ProductVariantRepository.findById(id);
        if (!variant) {
            throw new ApiError(404, "Product variant not found");
        }
        return variant;
    }

    async updateVariant(id, data) {
        const existingVariant = await ProductVariantRepository.findById(id);
        if (!existingVariant) {
            throw new ApiError(404, "Product variant not found");
        }

        if (data.variant_code && data.variant_code !== existingVariant.variant_code) {
            const codeTaken = await ProductVariantRepository.findByCode(data.variant_code);
            if (codeTaken) {
                throw new ApiError(409, "Variant code is already in use");
            }
        }

        const affectedRows = await ProductVariantRepository.update(id, data);
        if (affectedRows === 0) {
            throw new ApiError(500, "Failed to update variant");
        }

        return await ProductVariantRepository.findById(id);
    }

    async deleteVariant(id) {
        const variant = await ProductVariantRepository.findById(id);
        if (!variant) {
            throw new ApiError(404, "Product variant not found");
        }

        try {
            await ProductVariantRepository.delete(id);
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new ApiError(400, "Cannot delete variant because it is referenced in inventory or orders");
            }
            throw error;
        }

        return true;
    }
}

export default new ProductVariantService();
