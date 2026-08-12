import { pool } from '../config/db.js';

class StoneTypeRepository {
    async create(stoneData) {
        const fields = Object.keys(stoneData);
        const values = Object.values(stoneData);
        const placeholders = fields.map(() => '?').join(', ');

        const query = `INSERT INTO stone_types (${fields.join(', ')}) VALUES (${placeholders})`;
        const [result] = await pool.execute(query, values);
        return result.insertId;
    }

    async findAll() {
        const query = `SELECT * FROM stone_types ORDER BY stone_name ASC`;
        const [rows] = await pool.execute(query);
        return rows;
    }

    async findById(id) {
        const query = `SELECT * FROM stone_types WHERE stone_type_id = ?`;
        const [rows] = await pool.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async findByCode(code) {
        const query = `SELECT * FROM stone_types WHERE stone_code = ?`;
        const [rows] = await pool.execute(query, [code]);
        return rows.length > 0 ? rows[0] : null;
    }

    async update(id, updateData) {
        const fields = Object.keys(updateData);
        if (fields.length === 0) return 0;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = Object.values(updateData);
        values.push(id);

        const query = `UPDATE stone_types SET ${setClause} WHERE stone_type_id = ?`;
        const [result] = await pool.execute(query, values);
        return result.affectedRows;
    }

    async delete(id) {
        const query = `DELETE FROM stone_types WHERE stone_type_id = ?`;
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    }
}

export default new StoneTypeRepository();
