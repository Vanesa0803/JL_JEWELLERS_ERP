import CustomerRepository from '../repositories/customer.repository.js';
import { ApiError } from '../utils/ApiError.js';

class CustomerService {
    async createCustomer(data) {
        // Check if customer with mobile already exists
        const existingCustomer = await CustomerRepository.findByMobile(data.mobile);
        if (existingCustomer) {
            throw new ApiError(409, "Customer with this mobile number already exists");
        }

        delete data.customer_code;

        const customerId = await CustomerRepository.create(data);
        
        const customerCode = `CUS${String(customerId).padStart(6, '0')}`;
        await CustomerRepository.update(customerId, { customer_code: customerCode });
        
        return await CustomerRepository.findById(customerId);
    }

    async getCustomers(queryObj) {
        const page = parseInt(queryObj.page) || 1;
        const limit = parseInt(queryObj.limit) || 10;
        const offset = (page - 1) * limit;

        const filters = {
            search: queryObj.search,
            customerType: queryObj.customer_type,
            status: queryObj.status,
            sortBy: queryObj.sortBy,
            sortOrder: queryObj.sortOrder,
            limit,
            offset
        };

        const { rows, totalCount } = await CustomerRepository.findAll(filters);

        return {
            customers: rows,
            pagination: {
                totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        };
    }

    async getCustomerById(id) {
        const customer = await CustomerRepository.findById(id);
        if (!customer) {
            throw new ApiError(404, "Customer not found");
        }
        return customer;
    }

    async updateCustomer(id, data) {
        // Fetch existing record first
        const existingCustomer = await CustomerRepository.findById(id);
        if (!existingCustomer) {
            throw new ApiError(404, "Customer not found");
        }
        
        delete data.customer_code;

        // If mobile is being updated, ensure it's not taken
        if (data.mobile && data.mobile !== existingCustomer.mobile) {
            const mobileTaken = await CustomerRepository.findByMobile(data.mobile);
            if (mobileTaken) {
                throw new ApiError(409, "Mobile number is already registered to another customer");
            }
        }

        // Ensure we only update fields that are explicitly provided
        // Missing fields in 'data' will NOT overwrite existing values with null/undefined.
        // We only pass the fields that are present in the 'data' object.
        const updatePayload = {};
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                updatePayload[key] = value;
            }
        }

        const affectedRows = await CustomerRepository.update(id, updatePayload);
        if (affectedRows === 0) {
            throw new ApiError(500, "Failed to update customer");
        }

        return await CustomerRepository.findById(id);
    }

    async deleteCustomer(id) {
        const customer = await CustomerRepository.findById(id);
        if (!customer) {
            throw new ApiError(404, "Customer not found");
        }

        // Ideally, check for foreign key constraints here (e.g. if they have invoices)
        // Since we shouldn't change DB structure, we'll just try to delete
        try {
             await CustomerRepository.delete(id);
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new ApiError(400, "Cannot delete customer because they have associated records (e.g. bills, notes)");
            }
            throw error;
        }
        
        return true;
    }

    async activateCustomer(id, status) {
        if (!['Active', 'Inactive'].includes(status)) {
             throw new ApiError(400, "Invalid status. Must be 'Active' or 'Inactive'");
        }
        return await this.updateCustomer(id, { status });
    }
}

export default new CustomerService();
