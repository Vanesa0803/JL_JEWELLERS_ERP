import { pool } from '../../config/db.js';

class PurchaseOrderRepository {
    async create(orderData, items) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const orderFields = Object.keys(orderData);
            const orderValues = Object.values(orderData);
            const orderPlaceholders = orderFields.map(() => '?').join(', ');
            
            const orderQuery = `INSERT INTO purchase_orders (${orderFields.join(', ')}) VALUES (${orderPlaceholders})`;
            const [orderResult] = await connection.execute(orderQuery, orderValues);
            const orderId = orderResult.insertId;

            if (items && items.length > 0) {
                const itemQuery = `INSERT INTO purchase_order_items (purchase_order_id, product_id, ordered_quantity, purchase_rate, remarks) VALUES (?, ?, ?, ?, ?)`;
                for (const item of items) {
                    await connection.execute(itemQuery, [
                        orderId,
                        item.product_id,
                        item.ordered_quantity,
                        item.purchase_rate,
                        item.remarks || null
                    ]);
                }
            }

            await connection.commit();
            return orderId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async findAll({ supplier_id, order_status, limit, offset }) {
        let query = `SELECT po.*, s.supplier_name FROM purchase_orders po LEFT JOIN suppliers s ON po.supplier_id = s.supplier_id WHERE 1=1`;
        const params = [];

        if (supplier_id) {
            query += ` AND po.supplier_id = ?`;
            params.push(supplier_id);
        }
        if (order_status) {
            query += ` AND po.order_status = ?`;
            params.push(order_status);
        }

        query += ` ORDER BY po.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
        const [rows] = await pool.execute(query, params);

        let countQuery = `SELECT COUNT(*) as total FROM purchase_orders WHERE 1=1`;
        const countParams = [];
        if (supplier_id) {
            countQuery += ` AND supplier_id = ?`;
            countParams.push(supplier_id);
        }
        if (order_status) {
            countQuery += ` AND order_status = ?`;
            countParams.push(order_status);
        }

        const [countResult] = await pool.execute(countQuery, countParams);
        return { rows, totalCount: countResult[0].total };
    }

    async findById(id) {
        const query = `SELECT * FROM purchase_orders WHERE purchase_order_id = ?`;
        const [rows] = await pool.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async findByNumber(number) {
        const query = `SELECT * FROM purchase_orders WHERE purchase_order_number = ?`;
        const [rows] = await pool.execute(query, [number]);
        return rows.length > 0 ? rows[0] : null;
    }

    async getItems(orderId) {
        const query = `SELECT poi.*, p.product_name, p.product_code 
                       FROM purchase_order_items poi 
                       LEFT JOIN products p ON poi.product_id = p.product_id 
                       WHERE poi.purchase_order_id = ?`;
        const [rows] = await pool.execute(query, [orderId]);
        return rows;
    }

    async updateStatus(id, status) {
        const query = `UPDATE purchase_orders SET order_status = ? WHERE purchase_order_id = ?`;
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

        const query = `UPDATE purchase_orders SET ${setClause} WHERE purchase_order_id = ?`;
        const [result] = await pool.execute(query, values);
        return result.affectedRows;
    }

    async delete(id) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            // First delete items
            await connection.execute(`DELETE FROM purchase_order_items WHERE purchase_order_id = ?`, [id]);
            // Then delete header
            const [result] = await connection.execute(`DELETE FROM purchase_orders WHERE purchase_order_id = ?`, [id]);
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

export default new PurchaseOrderRepository();
