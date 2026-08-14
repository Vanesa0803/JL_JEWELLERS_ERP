import { pool } from '../../config/db.js';

class PurchaseReturnRepository {
    async create(returnData) {
        // Drop undefined values so omitted optional fields fall back to the
        // column default instead of failing with "Bind parameters must
        // not contain undefined".
        const definedEntries = Object.entries(returnData).filter(
            ([, value]) => value !== undefined
        );
        const fields = definedEntries.map(([key]) => key);
        const values = definedEntries.map(([, value]) => value);
        const placeholders = fields.map(() => '?').join(', ');

        const query = `INSERT INTO purchase_returns (${fields.join(', ')}) VALUES (${placeholders})`;
        const [result] = await pool.execute(query, values);
        return result.insertId;
    }

    async findAll({ supplier_id, limit, offset }) {
        let query = `SELECT pr.*, s.supplier_name FROM purchase_returns pr LEFT JOIN suppliers s ON pr.supplier_id = s.supplier_id WHERE 1=1`;
        const params = [];

        if (supplier_id) {
            query += ` AND pr.supplier_id = ?`;
            params.push(supplier_id);
        }

        query += ` ORDER BY pr.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
        const [rows] = await pool.execute(query, params);

        let countQuery = `SELECT COUNT(*) as total FROM purchase_returns WHERE 1=1`;
        const countParams = [];
        if (supplier_id) {
            countQuery += ` AND supplier_id = ?`;
            countParams.push(supplier_id);
        }

        const [countResult] = await pool.execute(countQuery, countParams);
        return { rows, totalCount: countResult[0].total };
    }

    async findById(id) {
        const query = `SELECT * FROM purchase_returns WHERE purchase_return_id = ?`;
        const [rows] = await pool.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async findByNumber(number) {
        const query = `SELECT * FROM purchase_returns WHERE return_number = ?`;
        const [rows] = await pool.execute(query, [number]);
        return rows.length > 0 ? rows[0] : null;
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

        const query = `UPDATE purchase_returns SET ${setClause} WHERE purchase_return_id = ?`;
        const [result] = await pool.execute(query, values);
        return result.affectedRows;
    }

    async delete(id) {
        const query = `DELETE FROM purchase_returns WHERE purchase_return_id = ?`;
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    }
}

export default new PurchaseReturnRepository();
