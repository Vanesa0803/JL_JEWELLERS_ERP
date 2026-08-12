import SupplierLedgerRepository from '../repositories/supplierLedger.repository.js';
import SupplierRepository from '../repositories/supplier.repository.js';
import { ApiError } from '../utils/ApiError.js';

class SupplierLedgerService {
    async getOutstandingBalance(supplierId) {
        const supplier = await SupplierRepository.findById(supplierId);
        if (!supplier) throw new ApiError(404, "Supplier not found");

        const balance = await SupplierLedgerRepository.getOutstandingBalance(supplierId);
        return {
            supplier_id: supplierId,
            outstanding_balance: balance
        };
    }

    async getLedgerTransactions(supplierId) {
        const supplier = await SupplierRepository.findById(supplierId);
        if (!supplier) throw new ApiError(404, "Supplier not found");

        return await SupplierLedgerRepository.getLedgerTransactions(supplierId);
    }
}

export default new SupplierLedgerService();
