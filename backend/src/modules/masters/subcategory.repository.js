import { pool } from '../../config/db.js';

class SubcategoryRepository {
    async create(subcategoryData) {
        const fields = Object.keys(subcategoryData);
        const values = Object.values(subcategoryData);
        const placeholders = fields.map(() => '?').join(', ');

        const query = `INSERT INTO subcategories (${fields.join(', ')}) VALUES (${placeholders})`;
        const [result] = await pool.execute(query, values);
        return result.insertId;
    }

    async findAllByCategoryId(categoryId) {
        const query = `SELECT * FROM subcategories WHERE category_id = ? ORDER BY subcategory_name ASC`;
        const [rows] = await pool.execute(query, [categoryId]);
        return rows;
    }

    async findById(id) {
        const query = `SELECT * FROM subcategories WHERE subcategory_id = ?`;
        const [rows] = await pool.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async findByCode(code) {
        const query = `SELECT * FROM subcategories WHERE subcategory_code = ?`;
        const [rows] = await pool.execute(query, [code]);
        return rows.length > 0 ? rows[0] : null;
    }

    async update(id, updateData) {
        const fields = Object.keys(updateData);
        if (fields.length === 0) return 0;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = Object.values(updateData);
        values.push(id);

        const query = `UPDATE subcategories SET ${setClause} WHERE subcategory_id = ?`;
        const [result] = await pool.execute(query, values);
        return result.affectedRows;
    }

    async delete(id) {
        const query = `DELETE FROM subcategories WHERE subcategory_id = ?`;
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    }
}

export default new SubcategoryRepository();
