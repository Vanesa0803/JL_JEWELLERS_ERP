import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import CustomerService from './customer.service.js';

const createCustomer = asyncHandler(async (req, res) => {
    // Basic validation in controller, can use express-validator later
    const { first_name, mobile } = req.body;
    if (!first_name || !mobile) {
        throw new ApiError(400, "First name and mobile are required");
    }

    const customer = await CustomerService.createCustomer(req.body);
    return res.status(201).json(new ApiResponse(201, customer, "Customer created successfully"));
});

const getCustomers = asyncHandler(async (req, res) => {
    const result = await CustomerService.getCustomers(req.query);
    return res.status(200).json(new ApiResponse(200, result, "Customers retrieved successfully"));
});

const getCustomerById = asyncHandler(async (req, res) => {
    const customer = await CustomerService.getCustomerById(req.params.id);
    return res.status(200).json(new ApiResponse(200, customer, "Customer retrieved successfully"));
});

const updateCustomer = asyncHandler(async (req, res) => {
    const customer = await CustomerService.updateCustomer(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, customer, "Customer updated successfully"));
});

const deleteCustomer = asyncHandler(async (req, res) => {
    await CustomerService.deleteCustomer(req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Customer deleted successfully"));
});

const activateCustomer = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const customer = await CustomerService.activateCustomer(req.params.id, status);
    return res.status(200).json(new ApiResponse(200, customer, `Customer status updated to ${status}`));
});

export {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    activateCustomer
};
