import { pool } from '../config/db.js';

class SupplierPaymentRepository {
    async create(paymentData) {
        const fields = Object.keys(paymentData);
        const values = Object.values(paymentData);
        const placeholders = fields.map(() => '?').join(', ');

        const query = `INSERT INTO supplier_payments (${fields.join(', ')}) VALUES (${placeholders})`;
        const [result] = await pool.execute(query, values);
        return result.insertId;
    }

    async findAll({ supplier_id, purchase_order_id, payment_method, limit, offset }) {
        let query = `SELECT sp.*, s.supplier_name 
                     FROM supplier_payments sp 
                     LEFT JOIN suppliers s ON sp.supplier_id = s.supplier_id 
                     WHERE 1=1`;
        const params = [];

        if (supplier_id) {
            query += ` AND sp.supplier_id = ?`;
            params.push(supplier_id);
        }
        if (purchase_order_id) {
            query += ` AND sp.purchase_order_id = ?`;
            params.push(purchase_order_id);
        }
        if (payment_method) {
            query += ` AND sp.payment_method = ?`;
            params.push(payment_method);
        }

        query += ` ORDER BY sp.payment_date DESC, sp.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
        const [rows] = await pool.execute(query, params);

        let countQuery = `SELECT COUNT(*) as total FROM supplier_payments WHERE 1=1`;
        const countParams = [];
        if (supplier_id) {
            countQuery += ` AND supplier_id = ?`;
            countParams.push(supplier_id);
        }
        if (purchase_order_id) {
            countQuery += ` AND purchase_order_id = ?`;
            countParams.push(purchase_order_id);
        }
        if (payment_method) {
            countQuery += ` AND payment_method = ?`;
            countParams.push(payment_method);
        }

        const [countResult] = await pool.execute(countQuery, countParams);
        return { rows, totalCount: countResult[0].total };
    }

    async findById(id) {
        const query = `SELECT * FROM supplier_payments WHERE supplier_payment_id = ?`;
        const [rows] = await pool.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async update(id, updateData) {
        const fields = Object.keys(updateData);
        if (fields.length === 0) return 0;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = Object.values(updateData);
        values.push(id);

        const query = `UPDATE supplier_payments SET ${setClause} WHERE supplier_payment_id = ?`;
        const [result] = await pool.execute(query, values);
        return result.affectedRows;
    }

    async delete(id) {
        const query = `DELETE FROM supplier_payments WHERE supplier_payment_id = ?`;
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    }
}

export default new SupplierPaymentRepository();
