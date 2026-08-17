import { pool } from '../../config/db.js';
import { assertColumns } from '../../utils/columnGuard.js';

/**
 * Apply a stock change for one GRN line, and record why it happened (S2-19).
 *
 * `delta` is positive when goods are received and negative when a GRN is
 * deleted and the receipt is being undone.
 *
 * NULL-SAFE ON PURPOSE
 * --------------------
 * `inventory` has no unique key on (product_id, variant_id), and variant_id is
 * NULL for every row in practice. That rules out INSERT ... ON DUPLICATE KEY:
 * with no unique key there is nothing to conflict on, and even with one, MySQL
 * treats NULLs as distinct, so every receipt of a variant-less product would
 * insert ANOTHER row instead of adding to the existing one. Stock would then
 * be split across duplicate rows and every total would read low.
 *
 * So the row is located with `<=>` (NULL-safe equality) and locked FOR UPDATE,
 * then updated or inserted. The lock is held until the caller's transaction
 * commits, so two receipts of the same product cannot both read the same
 * starting quantity and lose one of the increments.
 */
const applyStockChange = async (connection, { productId, variantId, delta, referenceNumber, remarks }) => {
    if (!delta) return;

    const [existing] = await connection.execute(
        `SELECT inventory_id, available_quantity
           FROM inventory
          WHERE product_id = ? AND variant_id <=> ?
          FOR UPDATE`,
        [productId, variantId ?? null]
    );

    if (existing.length > 0) {
        await connection.execute(
            `UPDATE inventory
                SET available_quantity = available_quantity + ?,
                    last_stock_update = CURRENT_TIMESTAMP
              WHERE inventory_id = ?`,
            [delta, existing[0].inventory_id]
        );
    } else {
        // First time this product has been stocked. Only on a receipt — a
        // reversal with no inventory row would mean undoing something that was
        // never applied, so it is left alone rather than creating a negative.
        if (delta < 0) return;

        await connection.execute(
            `INSERT INTO inventory (product_id, variant_id, available_quantity)
             VALUES (?, ?, ?)`,
            [productId, variantId ?? null, delta]
        );
    }

    // The audit trail. `stock_movements` already had a 'Purchase' movement type
    // and had never been written to from here.
    await connection.execute(
        `INSERT INTO stock_movements
            (product_id, variant_id, movement_type, quantity, reference_number, remarks)
         VALUES (?, ?, 'Purchase', ?, ?, ?)`,
        [productId, variantId ?? null, delta, referenceNumber || null, remarks || null]
    );
};

class GrnRepository {
    async create(grnData, items) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const grnFields = Object.keys(grnData);
            await assertColumns('goods_receipt_notes', grnFields);
            const grnValues = Object.values(grnData);
            const grnPlaceholders = grnFields.map(() => '?').join(', ');
            
            const grnQuery = `INSERT INTO goods_receipt_notes (${grnFields.join(', ')}) VALUES (${grnPlaceholders})`;
            const [grnResult] = await connection.execute(grnQuery, grnValues);
            const grnId = grnResult.insertId;

            if (items && items.length > 0) {
                const itemQuery = `INSERT INTO goods_receipt_items (grn_id, product_id, received_quantity, accepted_quantity, rejected_quantity, purchase_rate, remarks) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                for (const item of items) {
                    await connection.execute(itemQuery, [
                        grnId,
                        item.product_id,
                        item.received_quantity,
                        item.accepted_quantity,
                        item.rejected_quantity || 0,
                        item.purchase_rate || null,
                        item.remarks || null
                    ]);

                    /*
                     * S2-19 — receiving goods now adds them to stock.
                     *
                     * Previously this recorded the receipt and stopped. Stock
                     * only ever went DOWN (on sale), so recorded inventory
                     * drifted below the shelf a little further with every
                     * delivery, and nothing ever errored to say so. A shop
                     * would only notice when a reorder report told it to buy
                     * things it already had.
                     *
                     * ACCEPTED, not received: rejected goods are physically
                     * present but are going back to the supplier, so they are
                     * not stock. This is the whole reason the GRN separates
                     * the two quantities.
                     */
                    await applyStockChange(connection, {
                        productId: item.product_id,
                        variantId: item.variant_id,
                        delta: Number(item.accepted_quantity) || 0,
                        referenceNumber: grnData.grn_number,
                        remarks: `Goods received against GRN ${grnData.grn_number}`
                    });
                }
            }

            // Update purchase order status to 'Partially Received' or 'Completed' 
            // In a real robust system, we would calculate if all items are received.
            // Here, we just set it to Partially Received if it's currently Approved.
            const [poResult] = await connection.execute(`SELECT order_status FROM purchase_orders WHERE purchase_order_id = ?`, [grnData.purchase_order_id]);
            if (poResult.length > 0 && poResult[0].order_status === 'Approved') {
                await connection.execute(`UPDATE purchase_orders SET order_status = 'Partially Received' WHERE purchase_order_id = ?`, [grnData.purchase_order_id]);
            }

            await connection.commit();
            return grnId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async findAll({ supplier_id, purchase_order_id, status, limit, offset }) {
        let query = `SELECT grn.*, s.supplier_name, po.purchase_order_number 
                     FROM goods_receipt_notes grn 
                     LEFT JOIN suppliers s ON grn.supplier_id = s.supplier_id 
                     LEFT JOIN purchase_orders po ON grn.purchase_order_id = po.purchase_order_id 
                     WHERE 1=1`;
        const params = [];

        if (supplier_id) {
            query += ` AND grn.supplier_id = ?`;
            params.push(supplier_id);
        }
        if (purchase_order_id) {
            query += ` AND grn.purchase_order_id = ?`;
            params.push(purchase_order_id);
        }
        if (status) {
            query += ` AND grn.status = ?`;
            params.push(status);
        }

        query += ` ORDER BY grn.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
        const [rows] = await pool.execute(query, params);

        let countQuery = `SELECT COUNT(*) as total FROM goods_receipt_notes WHERE 1=1`;
        const countParams = [];
        if (supplier_id) {
            countQuery += ` AND supplier_id = ?`;
            countParams.push(supplier_id);
        }
        if (purchase_order_id) {
            countQuery += ` AND purchase_order_id = ?`;
            countParams.push(purchase_order_id);
        }
        if (status) {
            countQuery += ` AND status = ?`;
            countParams.push(status);
        }

        const [countResult] = await pool.execute(countQuery, countParams);
        return { rows, totalCount: countResult[0].total };
    }

    async findById(id) {
        const query = `SELECT * FROM goods_receipt_notes WHERE grn_id = ?`;
        const [rows] = await pool.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async findByNumber(number) {
        const query = `SELECT * FROM goods_receipt_notes WHERE grn_number = ?`;
        const [rows] = await pool.execute(query, [number]);
        return rows.length > 0 ? rows[0] : null;
    }

    async getItems(grnId) {
        const query = `SELECT gri.*, p.product_name, p.product_code 
                       FROM goods_receipt_items gri 
                       LEFT JOIN products p ON gri.product_id = p.product_id 
                       WHERE gri.grn_id = ?`;
        const [rows] = await pool.execute(query, [grnId]);
        return rows;
    }

    async updateStatus(id, status) {
        const query = `UPDATE goods_receipt_notes SET status = ? WHERE grn_id = ?`;
        const [result] = await pool.execute(query, [status, id]);
        return result.affectedRows;
    }

    async update(id, updateData) {
        // Drop undefined values: a partial update must leave omitted
        // columns untouched rather than overwriting them with NULL.
        const definedEntries = Object.entries(updateData).filter(
            ([, value]) => value !== undefined
        );
        const fields = definedEntries.map(([key]) => key);
        await assertColumns('goods_receipt_notes', fields);
        if (fields.length === 0) return 0;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = definedEntries.map(([, value]) => value);
        values.push(id);

        const query = `UPDATE goods_receipt_notes SET ${setClause} WHERE grn_id = ?`;
        const [result] = await pool.execute(query, values);
        return result.affectedRows;
    }

    async delete(id) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            /*
             * Take the stock back out before deleting the lines (S2-19).
             *
             * Now that receiving a GRN ADDS stock, deleting one has to remove
             * it again — otherwise deleting a receipt would leave the goods on
             * the books forever, which is the same drift the fix exists to
             * prevent, just in the opposite direction.
             *
             * This must read the items BEFORE the DELETE below, or there is
             * nothing left to reverse.
             */
            const [grnRows] = await connection.execute(
                `SELECT grn_number FROM goods_receipt_notes WHERE grn_id = ?`,
                [id]
            );
            const grnNumber = grnRows.length > 0 ? grnRows[0].grn_number : null;

            const [itemsToReverse] = await connection.execute(
                `SELECT product_id, accepted_quantity FROM goods_receipt_items WHERE grn_id = ?`,
                [id]
            );

            for (const item of itemsToReverse) {
                await applyStockChange(connection, {
                    productId: item.product_id,
                    variantId: null,
                    delta: -(Number(item.accepted_quantity) || 0),
                    referenceNumber: grnNumber,
                    remarks: `Reversed — GRN ${grnNumber || id} deleted`
                });
            }

            // First delete items
            await connection.execute(`DELETE FROM goods_receipt_items WHERE grn_id = ?`, [id]);
            // Then delete header
            const [result] = await connection.execute(`DELETE FROM goods_receipt_notes WHERE grn_id = ?`, [id]);
            await connection.commit();
            return result.affectedRows;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default new GrnRepository();
