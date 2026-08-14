import { pool } from '../../config/db.js';

class PurityRepository {
    async create(purityData) {
        // Drop undefined values so omitted optional fields fall back to the
        // column default instead of failing with "Bind parameters must
        // not contain undefined".
        const definedEntries = Object.entries(purityData).filter(
            ([, value]) => value !== undefined
        );
        const fields = definedEntries.map(([key]) => key);
        const values = definedEntries.map(([, value]) => value);
        const placeholders = fields.map(() => '?').join(', ');

        const query = `INSERT INTO purity (${fields.join(', ')}) VALUES (${placeholders})`;
        const [result] = await pool.execute(query, values);
        return result.insertId;
    }

    async findAll() {
        const query = `SELECT * FROM purity ORDER BY purity_name ASC`;
        const [rows] = await pool.execute(query);
        return rows;
    }

    async findById(id) {
        const query = `SELECT * FROM purity WHERE purity_id = ?`;
        const [rows] = await pool.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async findByCode(code) {
        const query = `SELECT * FROM purity WHERE purity_code = ?`;
        const [rows] = await pool.execute(query, [code]);
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

        const query = `UPDATE purity SET ${setClause} WHERE purity_id = ?`;
        const [result] = await pool.execute(query, values);
        return result.affectedRows;
    }

    async delete(id) {
        const query = `DELETE FROM purity WHERE purity_id = ?`;
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    }
}

export default new PurityRepository();
