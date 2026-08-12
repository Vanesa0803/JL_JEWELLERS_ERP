import InventoryAnalyticsRepository from '../repositories/inventoryAnalytics.repository.js';
import InventoryRepository from '../repositories/inventory.repository.js';

class InventoryAnalyticsService {
    async getGoldStock() {
        return await InventoryAnalyticsRepository.getMetalStock('Gold');
    }

    async getSilverStock() {
        return await InventoryAnalyticsRepository.getMetalStock('Silver');
    }

    async getPlatinumStock() {
        return await InventoryAnalyticsRepository.getMetalStock('Platinum');
    }

    async getDiamondStock() {
        // Diamond is a stone, so we query stones where name contains 'Diamond'
        const allStones = await InventoryAnalyticsRepository.getStoneStock();
        return allStones.filter(item => item.product_name && item.product_name.toLowerCase().includes('diamond'));
    }

    async getStoneStock() {
        return await InventoryAnalyticsRepository.getStoneStock();
    }

    async getDeadStock() {
        return await InventoryAnalyticsRepository.getDeadStock(6); // > 6 months
    }

    async getFastMoving() {
        return await InventoryAnalyticsRepository.getFastMoving();
    }

    async getSlowMoving() {
        return await InventoryAnalyticsRepository.getSlowMoving();
    }

    async getLowStock() {
        // Reuse InventoryRepository logic
        const result = await InventoryRepository.getLowStock({ limit: 100, offset: 0 });
        return result.rows;
    }

    async getOverstock() {
        return await InventoryAnalyticsRepository.getOverstock();
    }

    async getStockAging() {
        return await InventoryAnalyticsRepository.getStockAging();
    }
}

export default new InventoryAnalyticsService();
