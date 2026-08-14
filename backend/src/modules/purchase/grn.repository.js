import { pool } from '../../config/db.js';

class GrnRepository {
    async create(grnData, items) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const grnFields = Object.keys(grnData);
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
