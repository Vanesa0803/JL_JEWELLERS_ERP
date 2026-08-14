import { pool } from '../../config/db.js';

class MetalTypeRepository {
    async create(metalData) {
        // Drop undefined values so omitted optional fields fall back to the
        // column default instead of failing with "Bind parameters must
        // not contain undefined".
        const definedEntries = Object.entries(metalData).filter(
            ([, value]) => value !== undefined
        );
        const fields = definedEntries.map(([key]) => key);
        const values = definedEntries.map(([, value]) => value);
        const placeholders = fields.map(() => '?').join(', ');

        const query = `INSERT INTO metal_types (${fields.join(', ')}) VALUES (${placeholders})`;
        const [result] = await pool.execute(query, values);
        return result.insertId;
    }

    async findAll() {
        const query = `SELECT * FROM metal_types ORDER BY metal_name ASC`;
        const [rows] = await pool.execute(query);
        return rows;
    }

    async findById(id) {
        const query = `SELECT * FROM metal_types WHERE metal_type_id = ?`;
        const [rows] = await pool.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async findByCode(code) {
        const query = `SELECT * FROM metal_types WHERE metal_code = ?`;
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

        const query = `UPDATE metal_types SET ${setClause} WHERE metal_type_id = ?`;
        const [result] = await pool.execute(query, values);
        return result.affectedRows;
    }

    async delete(id) {
        const query = `DELETE FROM metal_types WHERE metal_type_id = ?`;
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    }
}

export default new MetalTypeRepository();
