import { Router } from 'express';
import {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    activateCustomer
} from '../controllers/customer.controller.js';

const router = Router();

router.route('/')
    .post(createCustomer)
    .get(getCustomers);

router.route('/:id')
    .get(getCustomerById)
    .put(updateCustomer)
    .delete(deleteCustomer);

router.route('/:id/activate')
    .patch(activateCustomer);

export default router;
