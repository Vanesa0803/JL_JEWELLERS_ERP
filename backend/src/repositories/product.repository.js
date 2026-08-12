import { pool } from '../config/db.js';

class ProductRepository {
    async create(productData) {
        const fields = Object.keys(productData);
        const values = Object.values(productData);
        const placeholders = fields.map(() => '?').join(', ');

        const query = `INSERT INTO products (${fields.join(', ')}) VALUES (${placeholders})`;
        const [result] = await pool.execute(query, values);
        return result.insertId;
    }

    async findAll({ category_id, is_active, search, limit, offset }) {
        let query = `SELECT * FROM products WHERE 1=1`;
        const params = [];

        if (category_id) {
            query += ` AND category_id = ?`;
            params.push(category_id);
        }
        if (is_active !== undefined) {
            query += ` AND is_active = ?`;
            params.push(is_active);
        }
        if (search) {
            query += ` AND (product_name LIKE ? OR product_code LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ` ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
        const [rows] = await pool.execute(query, params);

        let countQuery = `SELECT COUNT(*) as total FROM products WHERE 1=1`;
        const countParams = [];
        if (category_id) {
            countQuery += ` AND category_id = ?`;
            countParams.push(category_id);
        }
        if (is_active !== undefined) {
            countQuery += ` AND is_active = ?`;
            countParams.push(is_active);
        }
        if (search) {
            countQuery += ` AND (product_name LIKE ? OR product_code LIKE ?)`;
            countParams.push(`%${search}%`, `%${search}%`);
        }
        
        const [countResult] = await pool.execute(countQuery, countParams);
        return { rows, totalCount: countResult[0].total };
    }

    async findById(id) {
        const query = `SELECT * FROM products WHERE product_id = ?`;
        const [rows] = await pool.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async findByCode(code) {
        const query = `SELECT * FROM products WHERE product_code = ?`;
        const [rows] = await pool.execute(query, [code]);
        return rows.length > 0 ? rows[0] : null;
    }

    async update(id, updateData) {
        const fields = Object.keys(updateData);
        if (fields.length === 0) return 0;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = Object.values(updateData);
        values.push(id);

        const query = `UPDATE products SET ${setClause} WHERE product_id = ?`;
        const [result] = await pool.execute(query, values);
        return result.affectedRows;
    }

    async delete(id) {
        const query = `DELETE FROM products WHERE product_id = ?`;
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    }

    // --- Barcode Methods ---
    async addBarcode(productId, barcode, qrCode) {
        const query = `INSERT INTO product_barcodes (product_id, barcode, qr_code) VALUES (?, ?, ?)`;
        const [result] = await pool.execute(query, [productId, barcode, qrCode || null]);
        return result.insertId;
    }

    async getBarcodesByProductId(productId) {
        const query = `SELECT * FROM product_barcodes WHERE product_id = ?`;
        const [rows] = await pool.execute(query, [productId]);
        return rows;
    }

    async findBarcode(barcode) {
        const query = `SELECT * FROM product_barcodes WHERE barcode = ?`;
        const [rows] = await pool.execute(query, [barcode]);
        return rows.length > 0 ? rows[0] : null;
    }

    // --- Image Methods ---
    async addImage(productId, imagePath, imageType, isPrimary) {
        const query = `INSERT INTO product_images (product_id, image_path, image_type, is_primary) VALUES (?, ?, ?, ?)`;
        const [result] = await pool.execute(query, [productId, imagePath, imageType || 'Front', isPrimary ? 1 : 0]);
        return result.insertId;
    }

    async getImagesByProductId(productId) {
        const query = `SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, created_at ASC`;
        const [rows] = await pool.execute(query, [productId]);
        return rows;
    }
}

export default new ProductRepository();
