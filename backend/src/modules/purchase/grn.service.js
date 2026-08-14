import GrnRepository from './grn.repository.js';
import PurchaseOrderRepository from './purchaseOrder.repository.js';
import SupplierRepository from '../suppliers/supplier.repository.js';
import { ApiError } from '../../utils/ApiError.js';

class GrnService {
    async createGrn(data) {
        const { items, ...grnData } = data;

        if (!grnData.grn_number || !grnData.purchase_order_id || !grnData.supplier_id || !grnData.received_date) {
            throw new ApiError(400, "grn_number, purchase_order_id, supplier_id, and received_date are required");
        }

        const supplier = await SupplierRepository.findById(grnData.supplier_id);
        if (!supplier) throw new ApiError(404, "Supplier not found");

        const po = await PurchaseOrderRepository.findById(grnData.purchase_order_id);
        if (!po) throw new ApiError(404, "Purchase Order not found");

        const existingGrn = await GrnRepository.findByNumber(grnData.grn_number);
        if (existingGrn) throw new ApiError(409, "GRN number already exists");

        if (items && Array.isArray(items)) {
            for (const item of items) {
                if (!item.product_id || item.received_quantity === undefined || item.accepted_quantity === undefined) {
                    throw new ApiError(400, "Items must contain product_id, received_quantity, and accepted_quantity");
                }
            }
        }

        const grnId = await GrnRepository.create(grnData, items);
        return await this.getGrnById(grnId);
    }

    async getGrns(queryObj) {
        const page = parseInt(queryObj.page) || 1;
        const limit = parseInt(queryObj.limit) || 10;
        const offset = (page - 1) * limit;

        const filters = {
            supplier_id: queryObj.supplier_id,
            purchase_order_id: queryObj.purchase_order_id,
            status: queryObj.status,
            limit,
            offset
        };

        const { rows, totalCount } = await GrnRepository.findAll(filters);

        return {
            grns: rows,
            pagination: {
                totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        };
    }

    async getGrnById(id) {
        const grn = await GrnRepository.findById(id);
        if (!grn) {
            throw new ApiError(404, "GRN not found");
        }
        const items = await GrnRepository.getItems(id);
        return { ...grn, items };
    }

    async updateGrnStatus(id, status) {
        const grn = await GrnRepository.findById(id);
        if (!grn) throw new ApiError(404, "GRN not found");

        const allowedStatuses = ['Pending', 'Verified', 'Completed'];
        if (!allowedStatuses.includes(status)) {
            throw new ApiError(400, "Invalid GRN status");
        }

        await GrnRepository.updateStatus(id, status);
        return await GrnRepository.findById(id);
    }

    async updateGrn(id, data) {
        const grn = await GrnRepository.findById(id);
        if (!grn) throw new ApiError(404, "GRN not found");

        if (data.grn_number && data.grn_number !== grn.grn_number) {
            const existingGrn = await GrnRepository.findByNumber(data.grn_number);
            if (existingGrn) throw new ApiError(409, "GRN number already exists");
        }

        // We explicitly prevent updating items through this method for now, just the header
        delete data.items;
        
        await GrnRepository.update(id, data);
        return await this.getGrnById(id);
    }

    async deleteGrn(id) {
        const grn = await GrnRepository.findById(id);
        if (!grn) throw new ApiError(404, "GRN not found");

        if (grn.status === 'Completed') {
            throw new ApiError(400, "Completed GRN cannot be deleted");
        }

        try {
            await GrnRepository.delete(id);
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new ApiError(400, "Cannot delete GRN because it is referenced in returns or billing");
            }
            throw error;
        }

        return true;
    }
}

export default new GrnService();
