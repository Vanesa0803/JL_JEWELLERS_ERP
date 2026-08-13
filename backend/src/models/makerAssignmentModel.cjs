const db = require("../config/db.cjs");

const createAssignment = (assignmentData) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            INSERT INTO maker_assignments
            (

                customer_order_id,
                maker_id,
                assigned_date,
                expected_completion,
                assignment_status,
                remarks

            )

            VALUES (?,?,?,?,?,?)

            `,

            [

                assignmentData.customer_order_id,
                assignmentData.maker_id,
                assignmentData.assigned_date,
                assignmentData.expected_completion,
                "Assigned",
                assignmentData.remarks

            ],

            (err, result) => {

                if (err) {

                    return reject(err);

                }

                resolve(result.insertId);

            }

        );

    });

};

const getOrder = (orderId) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT *
            FROM customer_orders
            WHERE customer_order_id = ?
            `,

            [orderId],

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                resolve(rows[0]);

            }

        );

    });

};

const getMaker = (makerId) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT *
            FROM makers
            WHERE maker_id = ?
            `,

            [makerId],

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                resolve(rows[0]);

            }

        );

    });

};

const getActiveAssignment = (orderId) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT *
            FROM maker_assignments

            WHERE customer_order_id = ?

            AND assignment_status IN
            (

                'Assigned',
                'In Progress'

            )
            `,

            [orderId],

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                resolve(rows[0]);

            }

        );

    });

};

const updateAssignmentStatus = (assignmentId, status) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            UPDATE maker_assignments

            SET

                assignment_status = ?,

                actual_completion =
                    CASE
                        WHEN ? = 'Completed'
                        THEN CURDATE()
                        ELSE actual_completion
                    END

            WHERE assignment_id = ?
            `,

            [

                status,
                status,
                assignmentId

            ],

            (err, result) => {

                if (err) {

                    return reject(err);

                }

                resolve(result);

            }

        );

    });

};

const getAllAssignments = () => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                ma.assignment_id,

                co.order_number,

                mk.maker_name,

                ma.assigned_date,

                ma.expected_completion,

                ma.actual_completion,

                ma.assignment_status,

                ma.remarks

            FROM maker_assignments ma

            INNER JOIN customer_orders co

                ON ma.customer_order_id = co.customer_order_id

            INNER JOIN makers mk

                ON ma.maker_id = mk.maker_id

            ORDER BY ma.assignment_id DESC
            `,

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                resolve(rows);

            }

        );

    });

};

const getPendingAssignments = () => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                ma.assignment_id,
                co.order_number,
                mk.maker_name,
                ma.assigned_date,
                ma.expected_completion,
                ma.assignment_status

            FROM maker_assignments ma

            INNER JOIN customer_orders co

                ON ma.customer_order_id = co.customer_order_id

            INNER JOIN makers mk

                ON ma.maker_id = mk.maker_id

            WHERE ma.assignment_status IN
            (
                'Assigned',
                'In Progress'
            )

            ORDER BY ma.expected_completion
            `,

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                resolve(rows);

            }

        );

    });

};

const getDelayedAssignments = () => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                ma.assignment_id,

                co.order_number,

                mk.maker_name,

                ma.expected_completion,

                ma.assignment_status,

                DATEDIFF(CURDATE(), ma.expected_completion) AS delayed_days

            FROM maker_assignments ma

            INNER JOIN customer_orders co

                ON ma.customer_order_id = co.customer_order_id

            INNER JOIN makers mk

                ON ma.maker_id = mk.maker_id

            WHERE

                ma.assignment_status != 'Completed'

            AND

                ma.expected_completion < CURDATE()

            ORDER BY

                delayed_days DESC
            `,

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                resolve(rows);

            }

        );

    });

};


module.exports = {

    createAssignment,
    getOrder,
    getMaker,
    getActiveAssignment,
    updateAssignmentStatus,
    getAllAssignments,
    getPendingAssignments,
    getDelayedAssignments
    
};