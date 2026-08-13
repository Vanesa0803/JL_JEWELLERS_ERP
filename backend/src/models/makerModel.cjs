const db = require("../config/db.cjs");

const createMaker = (makerData) => {

    return new Promise((resolve, reject) => {

        const sql = `

        INSERT INTO makers

        (

            maker_code,
            maker_name,
            mobile,
            alternate_mobile,
            address,
            joining_date,
            experience_years,
            payment_type,
            remarks

        )

        VALUES (?,?,?,?,?,?,?,?,?)

        `;

        db.query(

            sql,

            [

                makerData.maker_code,
                makerData.maker_name,
                makerData.mobile,
                makerData.alternate_mobile,
                makerData.address,
                makerData.joining_date,
                makerData.experience_years,
                makerData.payment_type,
                makerData.remarks

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

const updateMakerCode = (makerId, makerCode) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            UPDATE makers
            SET maker_code = ?
            WHERE maker_id = ?
            `,

            [makerCode, makerId],

            (err, result) => {

                if (err) {

                    return reject(err);

                }

                resolve(result);

            }

        );

    });

};

const getAllMakers = () => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                maker_id,
                maker_code,
                maker_name,
                mobile,
                joining_date,
                experience_years,
                payment_type,
                status

            FROM makers

            ORDER BY maker_id DESC
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

const getMakerById = (makerId) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT
                *
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

const updateMaker = (makerId, makerData) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            UPDATE makers
            SET

                maker_name = ?,
                mobile = ?,
                alternate_mobile = ?,
                address = ?,
                joining_date = ?,
                experience_years = ?,
                payment_type = ?,
                remarks = ?

            WHERE maker_id = ?
            `,

            [

                makerData.maker_name,
                makerData.mobile,
                makerData.alternate_mobile,
                makerData.address,
                makerData.joining_date,
                makerData.experience_years,
                makerData.payment_type,
                makerData.remarks,
                makerId

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

const deactivateMaker = (makerId) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            UPDATE makers
            SET status = 'Inactive'
            WHERE maker_id = ?
            `,

            [makerId],

            (err, result) => {

                if (err) {

                    return reject(err);

                }

                resolve(result);

            }

        );

    });

};

const getMakerProductivity = () => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                mk.maker_id,

                mk.maker_name,

                COUNT(ma.assignment_id) AS total_assigned,

                SUM(
                    CASE
                        WHEN ma.assignment_status = 'Completed'
                        THEN 1
                        ELSE 0
                    END
                ) AS completed,

                SUM(
                    CASE
                        WHEN ma.assignment_status = 'In Progress'
                        THEN 1
                        ELSE 0
                    END
                ) AS in_progress,

                SUM(
                    CASE
                        WHEN ma.assignment_status = 'Delayed'
                        THEN 1
                        ELSE 0
                    END
                ) AS delayed_count

            FROM makers mk

            LEFT JOIN maker_assignments ma
            ON mk.maker_id = ma.maker_id

            GROUP BY
                mk.maker_id,
                mk.maker_name

            ORDER BY
                total_assigned DESC;
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

const getMakerPerformance = () => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                mk.maker_id,

                mk.maker_name,

                COUNT(ma.assignment_id) AS total_orders,

                SUM(
                    CASE
                        WHEN ma.assignment_status = 'Completed'
                        THEN 1
                        ELSE 0
                    END
                ) AS completed_orders,

                SUM(
                    CASE
                        WHEN ma.assignment_status = 'Delayed'
                        THEN 1
                        ELSE 0
                    END
                ) AS delayed_orders,

                SUM(
                    CASE
                        WHEN ma.assignment_status IN
                        ('Assigned','In Progress')
                        THEN 1
                        ELSE 0
                    END
                ) AS active_orders

            FROM makers mk

            LEFT JOIN maker_assignments ma

            ON mk.maker_id = ma.maker_id

            GROUP BY

                mk.maker_id,
                mk.maker_name

            ORDER BY

                total_orders DESC
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

const getMakerPaymentLedger = () => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                mk.maker_id,

                mk.maker_name,

                mk.payment_type,

                COUNT(mp.payment_id) AS total_payments,

                COALESCE(SUM(mp.amount),0) AS total_paid,

                SUM(
                    CASE
                        WHEN mp.payment_status='Pending'
                        THEN mp.amount
                        ELSE 0
                    END
                ) AS pending_amount,

                SUM(
                    CASE
                        WHEN mp.payment_status='Paid'
                        THEN mp.amount
                        ELSE 0
                    END
                ) AS paid_amount

            FROM makers mk

            LEFT JOIN maker_payments mp

                ON mk.maker_id = mp.maker_id

            GROUP BY

                mk.maker_id,
                mk.maker_name,
                mk.payment_type

            ORDER BY

                mk.maker_name
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

    createMaker,
    updateMakerCode,
    getAllMakers,
    getMakerById,
    updateMaker,
    deactivateMaker,
    getMakerProductivity,
    getMakerPerformance,
    getMakerPaymentLedger

};