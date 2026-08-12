import { pool } from '../config/db.js';

class ProductVariantRepository {
    async create(variantData) {
        const fields = Object.keys(variantData);
        const values = Object.values(variantData);
        const placeholders = fields.map(() => '?').join(', ');

        const query = `INSERT INTO product_variants (${fields.join(', ')}) VALUES (${placeholders})`;
        const [result] = await pool.execute(query, values);
        return result.insertId;
    }

    async findAllByProductId(productId) {
        const query = `SELECT * FROM product_variants WHERE product_id = ? ORDER BY created_at DESC`;
        const [rows] = await pool.execute(query, [productId]);
        return rows;
    }

    async findById(id) {
        const query = `SELECT * FROM product_variants WHERE variant_id = ?`;
        const [rows] = await pool.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async findByCode(code) {
        const query = `SELECT * FROM product_variants WHERE variant_code = ?`;
        const [rows] = await pool.execute(query, [code]);
        return rows.length > 0 ? rows[0] : null;
    }

    async update(id, updateData) {
        const fields = Object.keys(updateData);
        if (fields.length === 0) return 0;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = Object.values(updateData);
        values.push(id);

        const query = `UPDATE product_variants SET ${setClause} WHERE variant_id = ?`;
        const [result] = await pool.execute(query, values);
        return result.affectedRows;
    }

    async delete(id) {
        const query = `DELETE FROM product_variants WHERE variant_id = ?`;
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    }
}

export default new ProductVariantRepository();
