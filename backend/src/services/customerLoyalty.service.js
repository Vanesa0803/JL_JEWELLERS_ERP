import CustomerLoyaltyRepository from '../repositories/customerLoyalty.repository.js';
import CustomerRepository from '../repositories/customer.repository.js';
import { ApiError } from '../utils/ApiError.js';

class CustomerLoyaltyService {
    async getLoyaltyHistory(customerId) {
        const customer = await CustomerRepository.findById(customerId);
        if (!customer) {
            throw new ApiError(404, "Customer not found");
        }
        return await CustomerLoyaltyRepository.getLoyaltyHistory(customerId);
    }

    async earnPoints(customerId, data) {
        const customer = await CustomerRepository.findById(customerId);
        if (!customer) {
            throw new ApiError(404, "Customer not found");
        }

        const points = parseInt(data.points);
        if (!points || points <= 0) {
            throw new ApiError(400, "Valid points amount is required");
        }

        const currentPointsAfter = (customer.loyalty_points || 0) + points;
        await CustomerLoyaltyRepository.earnPoints(customerId, points, currentPointsAfter, data.remarks || "Points earned");
        
        return {
            points_earned: points,
            total_points: currentPointsAfter
        };
    }

    async redeemPoints(customerId, data) {
        const customer = await CustomerRepository.findById(customerId);
        if (!customer) {
            throw new ApiError(404, "Customer not found");
        }

        const points = parseInt(data.points);
        if (!points || points <= 0) {
            throw new ApiError(400, "Valid points amount is required");
        }

        if ((customer.loyalty_points || 0) < points) {
            throw new ApiError(400, "Insufficient loyalty points");
        }

        const currentPointsAfter = customer.loyalty_points - points;
        await CustomerLoyaltyRepository.redeemPoints(customerId, points, currentPointsAfter, data.remarks || "Points redeemed");
        
        return {
            points_redeemed: points,
            total_points: currentPointsAfter
        };
    }

    async getVIPCustomers(queryObj) {
        // Reuse the find logic from customer repository but force customer_type to VIP
        const page = parseInt(queryObj.page) || 1;
        const limit = parseInt(queryObj.limit) || 10;
        const offset = (page - 1) * limit;

        const filters = {
            search: queryObj.search,
            customerType: 'VIP',
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

    async setVIPStatus(customerId, isVIP) {
        const customer = await CustomerRepository.findById(customerId);
        if (!customer) {
            throw new ApiError(404, "Customer not found");
        }

        const customerType = isVIP ? 'VIP' : 'Regular';
        await CustomerRepository.update(customerId, { customer_type: customerType });
        return await CustomerRepository.findById(customerId);
    }
}

export default new CustomerLoyaltyService();
