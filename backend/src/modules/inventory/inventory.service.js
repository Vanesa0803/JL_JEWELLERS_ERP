import InventoryRepository from './inventory.repository.js';

const getCurrentStock = async (filters = {}) => {
    const limit = parseInt(filters.limit) || 10;
    const offset = parseInt(filters.offset) || 0;

    return await InventoryRepository.getCurrentStock({
        ...filters,
        limit,
        offset
    });
};

const getLowStock = async (filters = {}) => {
    const limit = parseInt(filters.limit) || 10;
    const offset = parseInt(filters.offset) || 0;

    return await InventoryRepository.getLowStock({
        ...filters,
        limit,
        offset
    });
};

const performStockOperation = async (data) => {
    if (!data.product_id) {
        throw new Error("product_id is required");
    }

    if (!data.quantity) {
        throw new Error("quantity is required");
    }

    const quantity = Math.abs(Number(data.quantity));

    if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
    }

    let quantity_change;

    if (data.action === 'OUT') {
        quantity_change = -quantity;
    } else {
        quantity_change = quantity;
    }

    const operationData = {
        ...data,
        quantity_change
    };

    return await InventoryRepository.executeStockOperation(operationData);
};

const getMovements = async (filters = {}) => {
    const limit = parseInt(filters.limit) || 10;
    const offset = parseInt(filters.offset) || 0;

    return await InventoryRepository.getMovements({
        ...filters,
        limit,
        offset
    });
};

export default {
    getCurrentStock,
    getLowStock,
    performStockOperation,
    getMovements
};
