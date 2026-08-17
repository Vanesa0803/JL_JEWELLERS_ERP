import connection, { callbackPool } from "../../config/db.js";
import { allocateInvoiceNumber } from "./invoiceNumber.js";

/**
 * Save Bill and Bill Items.
 *
 * Runs inside a transaction on ONE pooled connection. A transaction has to stay
 * pinned to a single connection, so this takes one out of the pool and returns
 * it in every exit path — success, failure and rollback.
 */
const createBill = (billData) => {

    return new Promise((resolve, reject) => {

      callbackPool.getConnection((connectionError, connection) => {

        if (connectionError) {
            return reject(connectionError);
        }

        const done = (error, value) => {
            connection.release();
            return error ? reject(error) : resolve(value);
        };

        const abort = (error) => {
            connection.rollback(() => done(error));
        };

        connection.beginTransaction((err) => {

            if (err) {
                return done(err);
            }

            const billQuery = `
                INSERT INTO bills
                (
                    invoice_number,
                    customer_id,
                    employee_id,
                    subtotal,
                    total_discount,
                    total_gst,
                    grand_total,
                    payment_status,
                    bill_status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            // The invoice number is allocated INSIDE this transaction, on this
            // connection. That is deliberate — see invoiceNumber.js. It used
            // to be "INV-" + Date.now(), which GST law does not accept (S1-8).
            allocateInvoiceNumber(connection, (invoiceError, invoiceNumber) => {

              if (invoiceError) {
                  return abort(invoiceError);
              }

              connection.query(

                billQuery,

                [
                    invoiceNumber,
                    billData.customer_id,
                    billData.employee_id,
                    billData.subtotal,
                    billData.total_discount,
                    billData.total_gst,
                    billData.grand_total,
                    billData.payment_status,
                    billData.bill_status
                ],

                (err, result) => {

                    if (err) {
                        return abort(err);
                    }

                    const billId = result.insertId;

                    // NOTE: there was a resolve() here, before the bill items
                    // were inserted and before COMMIT. Because a promise only
                    // settles once, the later resolve after commit did nothing
                    // — and if the item insert failed, the transaction rolled
                    // back while the caller had ALREADY been told the bill was
                    // created successfully. Bills could be reported saved when
                    // nothing was written. Removed; the only resolve is now
                    // after a successful commit.

                    const itemQuery = `
                        INSERT INTO bill_items
                        (
                            bill_id,
                            product_id,
                            metal_type,
                            purity,
                            quantity,
                            net_weight,
                            rate,
                            metal_value,
                            making_charge_percent,
                            making_charge,
                            taxable_value,
                            gst_metal,
                            gst_making,
                            discount,
                            line_total
                        )
                        VALUES ?
                    `;

                    const values = billData.items.map(item => [

                        billId,

                        item.product_id,

                        item.metal_type,

                        item.purity,

                        item.quantity,

                        item.net_weight,

                        item.rate,

                        item.metal_value,

                        item.making_charge_percent,

                        item.making_charge,

                        item.taxable_value,

                        item.gst_metal,

                        item.gst_making,

                        item.discount,

                        item.line_total

                    ]);

                    connection.query(

                        itemQuery,

                        [values],

                        (err) => {

                            if (err) {
                                return abort(err);
                            }

                            connection.commit((err) => {

                                if (err) {
                                    return abort(err);
                                }

                                done(null, {

                                    success: true,

                                    bill_id: billId,

                                    invoice_number: invoiceNumber,

                                    message: "Bill created successfully."

                                });

                            });

                        }

                    );

                }

              );

            });

        });

      });

    });

};

/**
 * Get All Bills
 */
const getAllBills = () => {

    return new Promise((resolve, reject) => {

        /*
         * Deleted bills must not appear in the list.
         *
         * This read from `invoice_summary` alone, and that view carries no
         * deleted_at column — so every soft-deleted bill came back with the
         * live ones. Measured before the fix: 22 rows returned for 15 live
         * bills. Cancelling a bill left it sitting in the list as though
         * nothing had happened.
         *
         * getBillById already joined `bills` for exactly this check, so the
         * detail view and the list disagreed about whether a bill existed.
         * The join brings the list into line.
         */
        const query = `
            SELECT
                s.bill_id,
                s.invoice_number,
                s.bill_date,
                s.customer_name,
                s.employee_name,
                s.grand_total,
                s.payment_status,
                s.bill_status
            FROM invoice_summary s
            INNER JOIN bills b
                ON s.bill_id = b.bill_id
            WHERE b.deleted_at IS NULL
            ORDER BY s.bill_date DESC;
        `;

        connection.query(query, (err, results) => {

            if (err) {
                return reject(err);
            }

            resolve(results);

        });

    });

};

/**
 * Get Single Bill with Items
 */
const getBillById = (billId) => {

    return new Promise((resolve, reject) => {

        const billQuery = `
            SELECT
                s.bill_id,
                s.invoice_number,
                s.bill_date,
                s.customer_name,
                s.employee_name,
                s.subtotal,
                s.total_discount,
                s.total_gst,
                s.grand_total,
                s.payment_status,
                s.bill_status

            FROM invoice_summary s

            INNER JOIN bills b
                ON s.bill_id = b.bill_id

            WHERE s.bill_id = ?
            AND b.deleted_at IS NULL;
        `;

        connection.query(
            billQuery,
            [billId],
            (err, billResult) => {

                if (err) {
                    return reject(err);
                }

                if (billResult.length === 0) {
                    return resolve(null);
                }

                const itemQuery = `
                    SELECT
                        bi.bill_item_id,
                        p.product_name,
                        bi.metal_type,
                        bi.purity,
                        bi.quantity,
                        bi.net_weight,
                        bi.rate,
                        bi.metal_value,
                        bi.making_charge_percent,
                        bi.making_charge,
                        bi.taxable_value,
                        bi.gst_metal,
                        bi.gst_making,
                        bi.discount,
                        bi.line_total

                    FROM bill_items bi

                    JOIN products p
                        ON bi.product_id = p.product_id

                    WHERE bi.bill_id = ?;
                `;

                connection.query(
                    itemQuery,
                    [billId],
                    (err, itemResult) => {

                        if (err) {
                            return reject(err);
                        }

                        resolve({

                            bill: billResult[0],

                            items: itemResult

                        });

                    }
                );

            }
        );

    });

};
/**
 * Update Bill Status
 */
const updateBillStatus = (billId, billStatus, paymentStatus) => {

    return new Promise((resolve, reject) => {

        const query = `
            UPDATE bills
            SET
                bill_status = ?,
                payment_status = ?
            WHERE bill_id = ?
        `;

        connection.query(

            query,

            [
                billStatus,
                paymentStatus,
                billId
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

const cancelBill = (billId) => {

    return new Promise((resolve, reject) => {

        const query = `
            UPDATE bills
            SET
                bill_status = 'Cancelled',
                updated_at = CURRENT_TIMESTAMP
            WHERE bill_id = ?
            AND bill_status = 'Completed'
            AND deleted_at IS NULL
        `;

        connection.query(query, [billId], (err, result) => {

            if (err) {
                return reject(err);
            }

            if (result.affectedRows === 0) {

                return reject(
                    new Error(
                        "Only active Completed bills can be cancelled."
                    )
                );

            }

            resolve(result);

        });

    });

};

const updateBill = (billId, billData) => {

    return new Promise((resolve, reject) => {

      // Same pooled-transaction pattern as createBill: one connection taken from
      // the pool, released on every exit path.
      callbackPool.getConnection((connectionError, connection) => {

        if (connectionError) {
            return reject(connectionError);
        }

        const done = (error, value) => {
            connection.release();
            return error ? reject(error) : resolve(value);
        };

        const abort = (error) => {
            connection.rollback(() => done(error));
        };

        connection.beginTransaction((err) => {

            if (err) {
                return done(err);
            }

            const updateBillQuery = `
                UPDATE bills
                SET
                    customer_id = ?,
                    employee_id = ?,
                    subtotal = ?,
                    total_discount = ?,
                    total_gst = ?,
                    grand_total = ?,
                    payment_status = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE bill_id = ?
            `;

            connection.query(

                updateBillQuery,

                [
                    billData.customer_id,
                    billData.employee_id,
                    billData.subtotal,
                    billData.total_discount,
                    billData.total_gst,
                    billData.grand_total,
                    billData.payment_status,
                    billId
                ],

                (err) => {

                    if (err) {

                        return abort(err);

                    }

                    const deleteItemsQuery = `
                        DELETE FROM bill_items
                        WHERE bill_id = ?
                    `;

                    connection.query(

                        deleteItemsQuery,

                        [billId],

                        (err) => {

                            if (err) {

                                return abort(err);

                            }

                            const insertItemsQuery = `
                                INSERT INTO bill_items
                                (
                                    bill_id,
                                    product_id,
                                    metal_type,
                                    purity,
                                    quantity,
                                    net_weight,
                                    rate,
                                    metal_value,
                                    making_charge_percent,
                                    making_charge,
                                    taxable_value,
                                    gst_metal,
                                    gst_making,
                                    discount,
                                    line_total
                                )
                                VALUES ?
                            `;

                            const values = billData.items.map(item => [

                                billId,
                                item.product_id,
                                item.metal_type,
                                item.purity,
                                item.quantity,
                                item.net_weight,
                                item.rate,
                                item.metal_value,
                                item.making_charge_percent,
                                item.making_charge,
                                item.taxable_value,
                                item.gst_metal,
                                item.gst_making,
                                item.discount,
                                item.line_total

                            ]);

                            connection.query(

                                insertItemsQuery,

                                [values],

                                (err) => {

                                    if (err) {

                                        return abort(err);

                                    }

                                    connection.commit((err) => {

                                        if (err) {

                                            return abort(err);

                                        }

                                        done(null, {
                                            success: true,
                                            message: "Bill updated successfully."
                                        });

                                    });

                                }

                            );

                        }

                    );

                }

            );

        });

      });

    });

};

const searchBills = (filters) => {

    return new Promise((resolve, reject) => {

        let query = `
            SELECT *
            FROM bills
            WHERE 1 = 1
        `;

        const values = [];

        if (filters.invoice_number) {
            query += " AND invoice_number LIKE ?";
            values.push(`%${filters.invoice_number}%`);
        }

        if (filters.customer_id) {
            query += " AND customer_id = ?";
            values.push(filters.customer_id);
        }

        if (filters.bill_status) {
            query += " AND bill_status = ?";
            values.push(filters.bill_status);
        }

        if (filters.payment_status) {
            query += " AND payment_status = ?";
            values.push(filters.payment_status);
        }

        query += " ORDER BY created_at DESC";

        connection.query(query, values, (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result);

        });

    });

};

const printInvoice = (billId) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT

                b.bill_id,
                b.invoice_number,
                b.bill_date,
                b.subtotal,
                b.total_discount,
                b.total_gst,
                b.grand_total,
                b.payment_status,
                b.bill_status,

                c.customer_id,
                c.customer_code,
                c.first_name,
                c.last_name,
                c.mobile,
                c.email,
                c.address_line1,
                c.address_line2,
                c.city,
                c.state,
                c.pincode,

                e.employee_id,
                e.name AS employee_name,

                bi.bill_item_id,
                bi.product_id,
                bi.metal_type,
                bi.purity,
                bi.quantity,
                bi.net_weight,
                bi.rate,
                bi.metal_value,
                bi.making_charge,
                bi.discount,
                bi.gst_metal,
                bi.gst_making,
                bi.line_total

            FROM bills b

            INNER JOIN customers c
                ON b.customer_id = c.customer_id

            INNER JOIN employees e
                ON b.employee_id = e.employee_id

            INNER JOIN bill_items bi
                ON b.bill_id = bi.bill_id

            WHERE b.bill_id = ?
        `;
        
        connection.query(query, [billId], (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result);

        });

    });

};

export {
    createBill,
    getAllBills,
    getBillById,
    updateBillStatus,
    updateBill,
    cancelBill,
    searchBills,
    printInvoice
};

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    createBill,
    getAllBills,
    getBillById,
    updateBillStatus,
    updateBill,
    cancelBill,
    searchBills,
    printInvoice,
};
