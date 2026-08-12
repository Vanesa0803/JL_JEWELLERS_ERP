import SupplierPaymentRepository from '../repositories/supplierPayment.repository.js';
import SupplierRepository from '../repositories/supplier.repository.js';
import PurchaseOrderRepository from '../repositories/purchaseOrder.repository.js';
import { ApiError } from '../utils/ApiError.js';

class SupplierPaymentService {
    async createPayment(data) {
        if (!data.supplier_id || !data.amount || !data.payment_date || !data.payment_method) {
            throw new ApiError(400, "supplier_id, amount, payment_date, and payment_method are required");
        }

        const supplier = await SupplierRepository.findById(data.supplier_id);
        if (!supplier) throw new ApiError(404, "Supplier not found");

        if (data.purchase_order_id) {
            const po = await PurchaseOrderRepository.findById(data.purchase_order_id);
            if (!po) throw new ApiError(404, "Purchase Order not found");
        }

        const allowedMethods = ['Cash','Cheque','Bank Transfer','UPI','NEFT','RTGS'];
        if (!allowedMethods.includes(data.payment_method)) {
            throw new ApiError(400, "Invalid payment method");
        }

        const paymentId = await SupplierPaymentRepository.create(data);
        return await SupplierPaymentRepository.findById(paymentId);
    }

    async getPayments(queryObj) {
        const page = parseInt(queryObj.page) || 1;
        const limit = parseInt(queryObj.limit) || 10;
        const offset = (page - 1) * limit;

        const filters = {
            supplier_id: queryObj.supplier_id,
            purchase_order_id: queryObj.purchase_order_id,
            payment_method: queryObj.payment_method,
            limit,
            offset
        };

        const { rows, totalCount } = await SupplierPaymentRepository.findAll(filters);

        return {
            supplierPayments: rows,
            pagination: {
                totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        };
    }

    async getPaymentById(id) {
        const payment = await SupplierPaymentRepository.findById(id);
        if (!payment) {
            throw new ApiError(404, "Supplier payment not found");
        }
        return payment;
    }

    async updatePayment(id, data) {
        const payment = await SupplierPaymentRepository.findById(id);
        if (!payment) throw new ApiError(404, "Supplier payment not found");

        if (data.payment_method) {
            const allowedMethods = ['Cash','Cheque','Bank Transfer','UPI','NEFT','RTGS'];
            if (!allowedMethods.includes(data.payment_method)) {
                throw new ApiError(400, "Invalid payment method");
            }
        }

        await SupplierPaymentRepository.update(id, data);
        return await SupplierPaymentRepository.findById(id);
    }

    async deletePayment(id) {
        const payment = await SupplierPaymentRepository.findById(id);
        if (!payment) throw new ApiError(404, "Supplier payment not found");

        await SupplierPaymentRepository.delete(id);
        return true;
    }
}

export default new SupplierPaymentService();
