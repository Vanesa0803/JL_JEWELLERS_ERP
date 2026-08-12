import CustomerLedgerRepository from '../repositories/customerLedger.repository.js';
import CustomerRepository from '../repositories/customer.repository.js';
import { ApiError } from '../utils/ApiError.js';

class CustomerLedgerService {
    async getOutstandingBalance(customerId) {
        const customer = await CustomerRepository.findById(customerId);
        if (!customer) throw new ApiError(404, "Customer not found");

        const balance = await CustomerLedgerRepository.getOutstandingBalance(customerId);
        return {
            customer_id: customerId,
            total_outstanding: balance
        };
    }

    async getLedgerTransactions(customerId) {
        const customer = await CustomerRepository.findById(customerId);
        if (!customer) throw new ApiError(404, "Customer not found");

        return await CustomerLedgerRepository.getLedgerTransactions(customerId);
    }
}

export default new CustomerLedgerService();
