const db = require("../config/db.cjs");

const createOrder = (connection, orderData) => {

    return new Promise((resolve, reject) => {

        const sql = `
        INSERT INTO customer_orders
        (
            order_number,
            customer_id,
            order_date,
            expected_delivery,
            order_type,
            total_amount,
            advance_amount,
            balance_amount,
            remarks,
            order_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(
            sql,
            [
                orderData.order_number,
                orderData.customer_id,
                orderData.order_date,
                orderData.expected_delivery,
                orderData.order_type,
                orderData.total_amount,
                orderData.advance_amount,
                orderData.balance_amount,
                orderData.remarks,
                "Pending"
            ],
            (err, result) => {

                if (err) return reject(err);

                resolve(result.insertId);

            }
        );

    });

};

const createOrderItem = (connection, orderId, item) => {

    return new Promise((resolve, reject) => {

        const sql = `
        INSERT INTO customer_order_items
        (
            customer_order_id,
            product_id,
            quantity,
            gross_weight,
            net_weight,
            purity_id,
            making_charge,
            estimated_price,
            remarks
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(
            sql,
            [
                orderId,
                item.product_id,
                item.quantity,
                item.gross_weight,
                item.net_weight,
                item.purity_id,
                item.making_charge,
                item.estimated_price,
                item.remarks
            ],
            (err) => {

                if (err) return reject(err);

                resolve();

            }
        );

    });

};

const createStatusHistory = (connection, orderId) => {

    return new Promise((resolve, reject) => {

        connection.query(

            `
            INSERT INTO order_status_history
            (
                customer_order_id,
                old_status,
                new_status,
                remarks
            )
            VALUES (?, ?, ?, ?)
            `,

            [
                orderId,
                null,
                "Pending",
                "Order Created"
            ],

            (err) => {

                if (err) return reject(err);

                resolve();

            }

        );

    });

};

const getAllOrders = () => {

    return new Promise((resolve, reject) => {

        const sql = `
        SELECT

            co.customer_order_id,
            co.order_number,

            CONCAT(
                c.first_name,
                ' ',
                IFNULL(c.last_name,'')
            ) AS customer_name,

            co.order_date,
            co.expected_delivery,
            co.order_type,
            co.total_amount,
            co.advance_amount,
            co.balance_amount,
            co.order_status

        FROM customer_orders co

        INNER JOIN customers c

        ON co.customer_id = c.customer_id

        ORDER BY co.customer_order_id DESC
        `;

        db.query(sql, (err, rows) => {

            if (err) return reject(err);

            resolve(rows);

        });

    });

};

const getOrderById = (orderId) => {

    return new Promise((resolve, reject) => {

        const sql = `

        SELECT

            co.*,

            CONCAT(
                c.first_name,
                ' ',
                IFNULL(c.last_name,'')
            ) AS customer_name,

            c.mobile,
            c.email

        FROM customer_orders co

        INNER JOIN customers c

        ON co.customer_id = c.customer_id

        WHERE co.customer_order_id = ?

        `;

        db.query(sql, [orderId], (err, rows) => {

            if (err) return reject(err);

            resolve(rows[0]);

        });

    });

};

const getOrderItems = (orderId) => {

    return new Promise((resolve, reject) => {

        const sql = `

        SELECT

            coi.*,

            p.product_name

        FROM customer_order_items coi

        LEFT JOIN products p

        ON coi.product_id = p.product_id

        WHERE customer_order_id = ?

        `;

        db.query(sql, [orderId], (err, rows) => {

            if (err) return reject(err);

            resolve(rows);

        });

    });

};

const getOrderHistory = (orderId) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT *

            FROM order_status_history

            WHERE customer_order_id = ?

            ORDER BY history_id
            `,

            [orderId],

            (err, rows) => {

                if (err) return reject(err);

                resolve(rows);

            }

        );

    });

};

const updateOrder = (orderId, orderData) => {

    return new Promise((resolve, reject) => {

        const sql = `
        UPDATE customer_orders
        SET
            expected_delivery = ?,
            order_type = ?,
            total_amount = ?,
            advance_amount = ?,
            balance_amount = ?,
            remarks = ?
        WHERE customer_order_id = ?
        `;

        db.query(
            sql,
            [
                orderData.expected_delivery,
                orderData.order_type,
                orderData.total_amount,
                orderData.advance_amount,
                orderData.balance_amount,
                orderData.remarks,
                orderId
            ],
            (err, result) => {

                if (err) return reject(err);

                resolve(result);

            }
        );

    });

};

const updateOrderStatus = (orderId, status) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            UPDATE customer_orders
            SET order_status = ?
            WHERE customer_order_id = ?
            `,

            [status, orderId],

            (err, result) => {

                if (err) return reject(err);

                resolve(result);

            }

        );

    });

};

const addOrderHistory = (orderId, oldStatus, newStatus, remarks) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            INSERT INTO order_status_history
            (
                customer_order_id,
                old_status,
                new_status,
                remarks
            )
            VALUES (?,?,?,?)
            `,

            [
                orderId,
                oldStatus,
                newStatus,
                remarks
            ],

            (err, result) => {

                if (err) return reject(err);

                resolve(result);

            }

        );

    });

};

const getCurrentStatus = (orderId) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT order_status
            FROM customer_orders
            WHERE customer_order_id = ?
            `,

            [orderId],

            (err, rows) => {

                if (err) return reject(err);

                resolve(rows[0]);

            }

        );

    });

};

module.exports = {

    createOrder,
    createOrderItem,
    createStatusHistory,
    getAllOrders,
    getOrderById,
    getOrderItems,
    getOrderHistory,
    updateOrder,
    updateOrderStatus,
    addOrderHistory,
    getCurrentStatus

};