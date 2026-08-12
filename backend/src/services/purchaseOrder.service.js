import PurchaseOrderRepository from '../repositories/purchaseOrder.repository.js';
import SupplierRepository from '../repositories/supplier.repository.js';
import { ApiError } from '../utils/ApiError.js';

class PurchaseOrderService {
    async createOrder(data) {
        const { items, ...orderData } = data;

        if (!orderData.purchase_order_number || !orderData.supplier_id || !orderData.order_date) {
            throw new ApiError(400, "purchase_order_number, supplier_id, and order_date are required");
        }

        const supplier = await SupplierRepository.findById(orderData.supplier_id);
        if (!supplier) throw new ApiError(404, "Supplier not found");

        const existingOrder = await PurchaseOrderRepository.findByNumber(orderData.purchase_order_number);
        if (existingOrder) throw new ApiError(409, "Purchase Order number already exists");

        let calculatedTotal = 0;
        if (items && Array.isArray(items)) {
            for (const item of items) {
                if (!item.product_id || !item.ordered_quantity || !item.purchase_rate) {
                    throw new ApiError(400, "Items must contain product_id, ordered_quantity, and purchase_rate");
                }
                calculatedTotal += (item.ordered_quantity * item.purchase_rate);
            }
        }
        
        if (!orderData.total_amount) {
            orderData.total_amount = calculatedTotal;
        }

        const orderId = await PurchaseOrderRepository.create(orderData, items);
        return await this.getOrderById(orderId);
    }

    async getOrders(queryObj) {
        const page = parseInt(queryObj.page) || 1;
        const limit = parseInt(queryObj.limit) || 10;
        const offset = (page - 1) * limit;

        const filters = {
            supplier_id: queryObj.supplier_id,
            order_status: queryObj.order_status,
            limit,
            offset
        };

        const { rows, totalCount } = await PurchaseOrderRepository.findAll(filters);

        return {
            purchaseOrders: rows,
            pagination: {
                totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        };
    }

    async getOrderById(id) {
        const order = await PurchaseOrderRepository.findById(id);
        if (!order) {
            throw new ApiError(404, "Purchase Order not found");
        }
        const items = await PurchaseOrderRepository.getItems(id);
        return { ...order, items };
    }

    async updateOrderStatus(id, status) {
        const order = await PurchaseOrderRepository.findById(id);
        if (!order) throw new ApiError(404, "Purchase Order not found");

        const allowedStatuses = ['Draft', 'Approved', 'Partially Received', 'Completed', 'Cancelled'];
        if (!allowedStatuses.includes(status)) {
            throw new ApiError(400, "Invalid order status");
        }

        await PurchaseOrderRepository.updateStatus(id, status);
        return await PurchaseOrderRepository.findById(id);
    }

    async updateOrder(id, data) {
        const order = await PurchaseOrderRepository.findById(id);
        if (!order) throw new ApiError(404, "Purchase Order not found");

        if (data.purchase_order_number && data.purchase_order_number !== order.purchase_order_number) {
            const existingOrder = await PurchaseOrderRepository.findByNumber(data.purchase_order_number);
            if (existingOrder) throw new ApiError(409, "Purchase Order number already exists");
        }

        // We explicitly prevent updating items through this method for now, just the header
        delete data.items;
        
        await PurchaseOrderRepository.update(id, data);
        return await this.getOrderById(id);
    }

    async deleteOrder(id) {
        const order = await PurchaseOrderRepository.findById(id);
        if (!order) throw new ApiError(404, "Purchase Order not found");

        if (order.order_status !== 'Draft' && order.order_status !== 'Cancelled') {
            throw new ApiError(400, "Only Draft or Cancelled orders can be deleted");
        }

        try {
            await PurchaseOrderRepository.delete(id);
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new ApiError(400, "Cannot delete Purchase Order because it is referenced elsewhere (e.g. GRN)");
            }
            throw error;
        }

        return true;
    }
}

export default new PurchaseOrderService();
