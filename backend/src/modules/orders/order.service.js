import { withTransaction } from "../../utils/withTransaction.js";

import customerOrderModel from "./order.model.js";

const createOrder = async (orderData) => {

    return withTransaction(async (db, resolve, reject) => {

            try {

                orderData.order_number =
                    "ORD-" + Date.now();

                orderData.order_date =
                    new Date()
                        .toISOString()
                        .split("T")[0];

                orderData.balance_amount =
                    Number(orderData.total_amount) -
                    Number(orderData.advance_amount);

                const orderId =
                    await customerOrderModel.createOrder(
                        db,
                        orderData
                    );

                for (const item of orderData.items) {

                    await customerOrderModel.createOrderItem(
                        db,
                        orderId,
                        item
                    );

                }

                await customerOrderModel.createStatusHistory(
                    db,
                    orderId
                );

                db.commit((err) => {

                    if (err) {

                        return db.rollback(() => {

                            reject(err);

                        });

                    }

                    resolve({

                        customer_order_id: orderId,

                        order_number:
                            orderData.order_number

                    });

                });

            }

            catch (error) {

                db.rollback(() => {

                    reject(error);

                });

            }

    });

};

const getAllOrders = async () => {

    const data =
        await customerOrderModel.getAllOrders();

    return data.map(order => ({

        customer_order_id:
            order.customer_order_id,

        order_number:
            order.order_number,

        customer_name:
            order.customer_name,

        order_date:
            order.order_date,

        expected_delivery:
            order.expected_delivery,

        order_type:
            order.order_type,

        total_amount:
            Number(order.total_amount),

        advance_amount:
            Number(order.advance_amount),

        balance_amount:
            Number(order.balance_amount),

        order_status:
            order.order_status

    }));

};

const getOrderById = async (orderId) => {

    const order =
        await customerOrderModel.getOrderById(orderId);

    if (!order) {

        throw new Error("Order not found");

    }

    const items =
        await customerOrderModel.getOrderItems(orderId);

    const history =
        await customerOrderModel.getOrderHistory(orderId);

    return {

        order: {

            ...order,

            total_amount:
                Number(order.total_amount),

            advance_amount:
                Number(order.advance_amount),

            balance_amount:
                Number(order.balance_amount),

            order_date:
                order.order_date
                    ?.toISOString()
                    .split("T")[0],

            expected_delivery:
                order.expected_delivery
                    ?.toISOString()
                    .split("T")[0]

        },

        items: items.map(item => ({

            ...item,

            gross_weight:
                Number(item.gross_weight),

            net_weight:
                Number(item.net_weight),

            making_charge:
                Number(item.making_charge),

            estimated_price:
                Number(item.estimated_price)

        })),

        history

    };

};

const updateOrder = async (orderId, orderData) => {

    orderData.balance_amount =
        Number(orderData.total_amount) -
        Number(orderData.advance_amount);

    await customerOrderModel.updateOrder(
        orderId,
        orderData
    );

    return {
        message: "Order updated successfully."
    };

};

const cancelOrder = async (orderId, remarks) => {

    return withTransaction(async (db, resolve, reject) => {

            try {

                const current =
                    await customerOrderModel.getCurrentStatus(orderId);

                if (!current) {

                    throw new Error("Order not found");

                }

                if (current.order_status === "Cancelled") {

                    throw new Error("Order is already cancelled");

                }

                await customerOrderModel.updateOrderStatus(

                    orderId,

                    "Cancelled"

                );

                await customerOrderModel.addOrderHistory(

                    orderId,

                    current.order_status,

                    "Cancelled",

                    remarks || "Order Cancelled"

                );

                db.commit((err) => {

                    if (err) {

                        return db.rollback(() => {

                            reject(err);

                        });

                    }

                    resolve({

                        message: "Order cancelled successfully."

                    });

                });

            }

            catch (error) {

                db.rollback(() => {

                    reject(error);

                });

            }

    });

};

const deliverOrder = async (orderId, remarks) => {

    return withTransaction(async (db, resolve, reject) => {

            try {

                const current =
                    await customerOrderModel.getCurrentStatus(orderId);

                if (!current) {

                    throw new Error("Order not found");

                }

                if (current.order_status === "Delivered") {

                    throw new Error("Order is already delivered");

                }

                if (current.order_status === "Cancelled") {

                    throw new Error("Cancelled order cannot be delivered");

                }

                await customerOrderModel.updateOrderStatus(

                    orderId,

                    "Delivered"

                );

                await customerOrderModel.addOrderHistory(

                    orderId,

                    current.order_status,

                    "Delivered",

                    remarks || "Order Delivered"

                );

                db.commit((err) => {

                    if (err) {

                        return db.rollback(() => reject(err));

                    }

                    resolve({

                        message: "Order delivered successfully."

                    });

                });

            }

            catch (error) {

                db.rollback(() => reject(error));

            }

    });

};

export {

    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    cancelOrder ,
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
