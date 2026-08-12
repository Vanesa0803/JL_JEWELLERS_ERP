import PurchaseReturnRepository from '../repositories/purchaseReturn.repository.js';
import SupplierRepository from '../repositories/supplier.repository.js';
import { ApiError } from '../utils/ApiError.js';

class PurchaseReturnService {
    async createReturn(data) {
        if (!data.return_number || !data.supplier_id || !data.return_date || !data.grn_id) {
            throw new ApiError(400, "return_number, supplier_id, grn_id, and return_date are required");
        }

        const supplier = await SupplierRepository.findById(data.supplier_id);
        if (!supplier) throw new ApiError(404, "Supplier not found");

        const existingReturn = await PurchaseReturnRepository.findByNumber(data.return_number);
        if (existingReturn) throw new ApiError(409, "Purchase Return number already exists");

        const returnId = await PurchaseReturnRepository.create(data);
        return await PurchaseReturnRepository.findById(returnId);
    }

    async getReturns(queryObj) {
        const page = parseInt(queryObj.page) || 1;
        const limit = parseInt(queryObj.limit) || 10;
        const offset = (page - 1) * limit;

        const filters = {
            supplier_id: queryObj.supplier_id,
            limit,
            offset
        };

        const { rows, totalCount } = await PurchaseReturnRepository.findAll(filters);

        return {
            purchaseReturns: rows,
            pagination: {
                totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        };
    }

    async getReturnById(id) {
        const returnData = await PurchaseReturnRepository.findById(id);
        if (!returnData) {
            throw new ApiError(404, "Purchase Return not found");
        }
        return returnData;
    }

    async updateReturn(id, data) {
        const returnData = await PurchaseReturnRepository.findById(id);
        if (!returnData) throw new ApiError(404, "Purchase Return not found");

        if (data.return_number && data.return_number !== returnData.return_number) {
            const existingReturn = await PurchaseReturnRepository.findByNumber(data.return_number);
            if (existingReturn) throw new ApiError(409, "Purchase Return number already exists");
        }

        await PurchaseReturnRepository.update(id, data);
        return await PurchaseReturnRepository.findById(id);
    }

    async deleteReturn(id) {
        const returnData = await PurchaseReturnRepository.findById(id);
        if (!returnData) throw new ApiError(404, "Purchase Return not found");

        await PurchaseReturnRepository.delete(id);
        return true;
    }
}

export default new PurchaseReturnService();
