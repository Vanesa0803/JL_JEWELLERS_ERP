import SupplierRepository from './supplier.repository.js';
import { ApiError } from '../../utils/ApiError.js';

class SupplierService {
    async createSupplier(data) {
        // Check if supplier with mobile already exists
        const existingSupplier = await SupplierRepository.findByMobile(data.mobile);
        if (existingSupplier) {
            throw new ApiError(409, "Supplier with this mobile number already exists");
        }

        delete data.supplier_code;

        const supplierId = await SupplierRepository.create(data);
        
        const supplierCode = `SUP${String(supplierId).padStart(6, '0')}`;
        await SupplierRepository.update(supplierId, { supplier_code: supplierCode });
        
        return await SupplierRepository.findById(supplierId);
    }

    async getSuppliers(queryObj) {
        const page = parseInt(queryObj.page) || 1;
        const limit = parseInt(queryObj.limit) || 10;
        const offset = (page - 1) * limit;

        const filters = {
            search: queryObj.search,
            supplierType: queryObj.supplier_type,
            status: queryObj.status,
            sortBy: queryObj.sortBy,
            sortOrder: queryObj.sortOrder,
            limit,
            offset
        };

        const { rows, totalCount } = await SupplierRepository.findAll(filters);

        return {
            suppliers: rows,
            pagination: {
                totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        };
    }

    async getSupplierById(id) {
        const supplier = await SupplierRepository.findById(id);
        if (!supplier) {
            throw new ApiError(404, "Supplier not found");
        }
        return supplier;
    }

    async updateSupplier(id, data) {
        const existingSupplier = await SupplierRepository.findById(id);
        if (!existingSupplier) {
            throw new ApiError(404, "Supplier not found");
        }
        
        delete data.supplier_code;

        if (data.mobile && data.mobile !== existingSupplier.mobile) {
            const mobileTaken = await SupplierRepository.findByMobile(data.mobile);
            if (mobileTaken) {
                throw new ApiError(409, "Mobile number is already registered to another supplier");
            }
        }

        const updatePayload = {};
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                updatePayload[key] = value;
            }
        }

        const affectedRows = await SupplierRepository.update(id, updatePayload);
        if (affectedRows === 0) {
            throw new ApiError(500, "Failed to update supplier");
        }

        return await SupplierRepository.findById(id);
    }

    async deleteSupplier(id) {
        const supplier = await SupplierRepository.findById(id);
        if (!supplier) {
            throw new ApiError(404, "Supplier not found");
        }

        try {
             await SupplierRepository.delete(id);
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new ApiError(400, "Cannot delete supplier because they have associated records (e.g. orders, receipts)");
            }
            throw error;
        }
        
        return true;
    }

    async activateSupplier(id, status) {
        if (!['Active', 'Inactive'].includes(status)) {
             throw new ApiError(400, "Invalid status. Must be 'Active' or 'Inactive'");
        }
        return await this.updateSupplier(id, { status });
    }
}

export default new SupplierService();
