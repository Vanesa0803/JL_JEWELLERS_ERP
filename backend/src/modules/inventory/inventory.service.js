import InventoryRepository from './inventory.repository.js';
// Cross-module: stock movements are recorded against a product, so the
// service confirms the product exists before touching inventory.
import ProductRepository from '../products/product.repository.js';
import { ApiError } from '../../utils/ApiError.js';

class InventoryService {
    async getCurrentStock(queryObj) {
        const page = parseInt(queryObj.page) || 1;
        const limit = parseInt(queryObj.limit) || 10;
        const offset = (page - 1) * limit;

        const filters = {
            product_id: queryObj.product_id,
            variant_id: queryObj.variant_id,
            limit,
            offset
        };

        const { rows, totalCount } = await InventoryRepository.getCurrentStock(filters);

        return {
            stock: rows,
            pagination: {
                totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        };
    }

    async getLowStock(queryObj) {
        const page = parseInt(queryObj.page) || 1;
        const limit = parseInt(queryObj.limit) || 10;
        const offset = (page - 1) * limit;

        const { rows, totalCount } = await InventoryRepository.getLowStock({ limit, offset });

        return {
            stock: rows,
            pagination: {
                totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        };
    }

    async performStockOperation(data) {
        if (!data.product_id || !data.quantity || !data.movement_type) {
            throw new ApiError(400, "product_id, quantity, and movement_type are required");
        }

        const product = await ProductRepository.findById(data.product_id);
        if (!product) throw new ApiError(404, "Product not found");

        const allowedTypes = ['Purchase', 'Sale', 'Return', 'Repair', 'Adjustment', 'Opening Stock', 'Transfer'];
        if (!allowedTypes.includes(data.movement_type)) {
            throw new ApiError(400, "Invalid movement type");
        }

        // Validate stock logic
        let quantity_change = parseInt(data.quantity);
        if (data.action === 'OUT') {
            quantity_change = -Math.abs(quantity_change);
        } else if (data.action === 'IN') {
            quantity_change = Math.abs(quantity_change);
        }

        const existingStock = await InventoryRepository.findStockRecord(data.product_id, data.variant_id);
        if (quantity_change < 0) {
            const currentQty = existingStock ? existingStock.available_quantity : 0;
            if (currentQty + quantity_change < 0) {
                throw new ApiError(400, "Insufficient stock for this operation");
            }
        }

        const operationData = {
            product_id: data.product_id,
            variant_id: data.variant_id,
            quantity_change,
            movement_type: data.movement_type,
            reference_number: data.reference_number,
            remarks: data.remarks
        };

        await InventoryRepository.executeStockOperation(operationData);
        return { success: true, message: "Stock operation completed successfully" };
    }

    async getMovements(queryObj) {
        const page = parseInt(queryObj.page) || 1;
        const limit = parseInt(queryObj.limit) || 20;
        const offset = (page - 1) * limit;

        const filters = {
            product_id: queryObj.product_id,
            limit,
            offset
        };

        const { rows, totalCount } = await InventoryRepository.getMovements(filters);

        return {
            movements: rows,
            pagination: {
                totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        };
    }
}

export default new InventoryService();
