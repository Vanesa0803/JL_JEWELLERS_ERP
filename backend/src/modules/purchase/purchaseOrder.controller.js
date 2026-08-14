import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import PurchaseOrderService from './purchaseOrder.service.js';

const createOrder = asyncHandler(async (req, res) => {
    const order = await PurchaseOrderService.createOrder(req.body);
    return res.status(201).json(new ApiResponse(201, order, "Purchase Order created successfully"));
});

const getOrders = asyncHandler(async (req, res) => {
    const result = await PurchaseOrderService.getOrders(req.query);
    return res.status(200).json(new ApiResponse(200, result, "Purchase Orders retrieved successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
    const order = await PurchaseOrderService.getOrderById(req.params.id);
    return res.status(200).json(new ApiResponse(200, order, "Purchase Order retrieved successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { order_status } = req.body;
    const order = await PurchaseOrderService.updateOrderStatus(req.params.id, order_status);
    return res.status(200).json(new ApiResponse(200, order, "Purchase Order status updated successfully"));
});

const updateOrder = asyncHandler(async (req, res) => {
    const order = await PurchaseOrderService.updateOrder(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, order, "Purchase Order updated successfully"));
});

const deleteOrder = asyncHandler(async (req, res) => {
    await PurchaseOrderService.deleteOrder(req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Purchase Order deleted successfully"));
});

export {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    updateOrder,
    deleteOrder
};
