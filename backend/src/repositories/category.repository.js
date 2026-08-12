import { pool } from '../config/db.js';

class CategoryRepository {
    async create(categoryData) {
        const fields = Object.keys(categoryData);
        const values = Object.values(categoryData);
        const placeholders = fields.map(() => '?').join(', ');

        const query = `INSERT INTO categories (${fields.join(', ')}) VALUES (${placeholders})`;
        const [result] = await pool.execute(query, values);
        return result.insertId;
    }

    async findAll() {
        const query = `SELECT * FROM categories ORDER BY display_order ASC, category_name ASC`;
        const [rows] = await pool.execute(query);
        return rows;
    }

    async findById(id) {
        const query = `SELECT * FROM categories WHERE category_id = ?`;
        const [rows] = await pool.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async findByCode(code) {
        const query = `SELECT * FROM categories WHERE category_code = ?`;
        const [rows] = await pool.execute(query, [code]);
        return rows.length > 0 ? rows[0] : null;
    }

    async update(id, updateData) {
        const fields = Object.keys(updateData);
        if (fields.length === 0) return 0;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = Object.values(updateData);
        values.push(id);

        const query = `UPDATE categories SET ${setClause} WHERE category_id = ?`;
        const [result] = await pool.execute(query, values);
        return result.affectedRows;
    }

    async delete(id) {
        const query = `DELETE FROM categories WHERE category_id = ?`;
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    }
}

export default new CategoryRepository();
