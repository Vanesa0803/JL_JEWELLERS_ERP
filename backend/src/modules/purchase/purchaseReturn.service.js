import PurchaseReturnRepository from './purchaseReturn.repository.js';
import SupplierRepository from '../suppliers/supplier.repository.js';
import { ApiError } from '../../utils/ApiError.js';

class PurchaseReturnService {
    async createReturn(data) {
        if (!data.return_number || !data.supplier_id || !data.return_date || !data.grn_id) {
            throw new ApiError(400, "return_number, supplier_id, grn_id, and return_date are required");
        }

        const supplier = await SupplierRepository.findById(data.supplier_id);
        if (!supplier) throw new ApiError(404, "Supplier not found");

        const existingReturn = await PurchaseReturnRepository.findByNumber(data.return_number);
        if (existingReturn) throw new ApiError(409, "Purchase Return number already exists");

        /*
         * Only real columns reach the repository.
         *
         * The repository builds its INSERT from Object.keys(data), so ANY key
         * the caller sends becomes a column name. Posting an `items` array —
         * a reasonable thing to try, since purchase ORDERS take one — failed
         * with "Unknown column 'items' in 'field list'". A purchase return has
         * no line items: it is a single header row against a GRN.
         *
         * purchaseOrder.service.js already separates its items this way; this
         * service did not. Picking the columns explicitly also stops a caller
         * writing to fields it should not (S1-7 in REMEDIATION_BACKLOG.md).
         */
        const returnData = {
            return_number: data.return_number,
            supplier_id: data.supplier_id,
            grn_id: data.grn_id,
            return_date: data.return_date,
            total_amount: data.total_amount,
            reason: data.reason ?? data.remarks,
        };

        const returnId = await PurchaseReturnRepository.create(returnData);
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
