import CustomerAnalyticsRepository from '../repositories/customerAnalytics.repository.js';
import CustomerRepository from '../repositories/customer.repository.js';
import { ApiError } from '../utils/ApiError.js';

class CustomerAnalyticsService {
    async getPurchaseHistory(customerId) {
        const customer = await CustomerRepository.findById(customerId);
        if (!customer) throw new ApiError(404, "Customer not found");

        return await CustomerAnalyticsRepository.getPurchaseHistory(customerId);
    }

    async getLifetimeValue(customerId) {
        const customer = await CustomerRepository.findById(customerId);
        if (!customer) throw new ApiError(404, "Customer not found");

        return await CustomerAnalyticsRepository.getLifetimeValue(customerId);
    }

    async getUpcomingBirthdays(queryObj) {
        const daysAhead = parseInt(queryObj.days) || 30; // default to 30 days
        return await CustomerAnalyticsRepository.getUpcomingBirthdays(daysAhead);
    }

    async getUpcomingAnniversaries(queryObj) {
        const daysAhead = parseInt(queryObj.days) || 30; // default to 30 days
        return await CustomerAnalyticsRepository.getUpcomingAnniversaries(daysAhead);
    }
}

export default new CustomerAnalyticsService();
