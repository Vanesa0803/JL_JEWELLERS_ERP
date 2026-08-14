import customerOrderService from "./order.service.js";

const createOrder = async (req, res) => {

    try {

        const data =
            await customerOrderService.createOrder(req.body);

        res.status(201).json({

            success: true,

            message: "Customer order created successfully.",

            data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getAllOrders = async (req, res) => {

    try {

        const data =
            await customerOrderService.getAllOrders();

        res.json({

            success: true,

            data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getOrderById = async (req, res) => {

    try {

        const data =
            await customerOrderService.getOrderById(
                req.params.id
            );

        res.json({

            success: true,

            data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const updateOrder = async (req, res) => {

    try {

        const data =
            await customerOrderService.updateOrder(
                req.params.id,
                req.body
            );

        res.json({

            success: true,

            data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const cancelOrder = async (req, res) => {

    try {

        const data =
            await customerOrderService.cancelOrder(

                req.params.id,

                req.body.remarks

            );

        res.json({

            success: true,

            data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const deliverOrder = async (req, res) => {

    try {

        const data =
            await customerOrderService.deliverOrder(

                req.params.id,

                req.body.remarks

            );

        res.json({

            success: true,

            data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export {

    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    cancelOrder,
    deliverOrder

};

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    cancelOrder,
    deliverOrder,
};
