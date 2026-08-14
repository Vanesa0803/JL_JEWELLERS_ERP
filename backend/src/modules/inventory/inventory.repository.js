import { pool } from '../../config/db.js';

class InventoryRepository {
    async getCurrentStock({ product_id, variant_id, limit, offset }) {
        let query = `SELECT i.*, p.product_name, p.product_code 
                     FROM inventory i 
                     LEFT JOIN products p ON i.product_id = p.product_id 
                     WHERE 1=1`;
        const params = [];

        if (product_id) {
            query += ` AND i.product_id = ?`;
            params.push(product_id);
        }
        if (variant_id) {
            query += ` AND i.variant_id = ?`;
            params.push(variant_id);
        }

        query += ` ORDER BY i.last_stock_update DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
        const [rows] = await pool.execute(query, params);

        let countQuery = `SELECT COUNT(*) as total FROM inventory WHERE 1=1`;
        const countParams = [];
        if (product_id) {
            countQuery += ` AND product_id = ?`;
            countParams.push(product_id);
        }
        if (variant_id) {
            countQuery += ` AND variant_id = ?`;
            countParams.push(variant_id);
        }

        const [countResult] = await pool.execute(countQuery, countParams);
        return { rows, totalCount: countResult[0].total };
    }

    async getLowStock({ limit, offset }) {
        const query = `SELECT i.*, p.product_name, p.product_code 
                       FROM inventory i 
                       LEFT JOIN products p ON i.product_id = p.product_id 
                       WHERE i.available_quantity <= i.minimum_stock 
                       ORDER BY i.available_quantity ASC 
                       LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
        const [rows] = await pool.execute(query);

        const countQuery = `SELECT COUNT(*) as total FROM inventory WHERE available_quantity <= minimum_stock`;
        const [countResult] = await pool.execute(countQuery);

        return { rows, totalCount: countResult[0].total };
    }

    async findStockRecord(productId, variantId = null) {
        let query = `SELECT * FROM inventory WHERE product_id = ?`;
        const params = [productId];

        if (variantId) {
            query += ` AND variant_id = ?`;
            params.push(variantId);
        } else {
            query += ` AND variant_id IS NULL`;
        }

        const [rows] = await pool.execute(query, params);
        return rows.length > 0 ? rows[0] : null;
    }

    async updateStock(connection, data) {
        const { product_id, variant_id, quantity_change, movement_type, reference_number, remarks } = data;
        
        const existingStock = await this.findStockRecord(product_id, variant_id);

        if (!existingStock) {
            // Create new inventory record if it doesn't exist (assuming 0 base)
            const insertInvQuery = `INSERT INTO inventory (product_id, variant_id, available_quantity) VALUES (?, ?, ?)`;
            await connection.execute(insertInvQuery, [product_id, variant_id || null, quantity_change]);
        } else {
            // Update existing inventory
            const updateInvQuery = `UPDATE inventory SET available_quantity = available_quantity + ?, last_stock_update = CURRENT_TIMESTAMP WHERE inventory_id = ?`;
            await connection.execute(updateInvQuery, [quantity_change, existingStock.inventory_id]);
        }

        // Create stock movement record
        const insertMovQuery = `INSERT INTO stock_movements (product_id, variant_id, movement_type, quantity, reference_number, remarks) VALUES (?, ?, ?, ?, ?, ?)`;
        await connection.execute(insertMovQuery, [
            product_id,
            variant_id || null,
            movement_type,
            quantity_change,
            reference_number || null,
            remarks || null
        ]);
    }

    async executeStockOperation(data) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            await this.updateStock(connection, data);
            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async getMovements({ product_id, limit, offset }) {
        let query = `SELECT sm.*, p.product_name 
                     FROM stock_movements sm 
                     LEFT JOIN products p ON sm.product_id = p.product_id 
                     WHERE 1=1`;
        const params = [];

        if (product_id) {
            query += ` AND sm.product_id = ?`;
            params.push(product_id);
        }

        query += ` ORDER BY sm.movement_date DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
        const [rows] = await pool.execute(query, params);

        let countQuery = `SELECT COUNT(*) as total FROM stock_movements WHERE 1=1`;
        const countParams = [];
        if (product_id) {
            countQuery += ` AND product_id = ?`;
            countParams.push(product_id);
        }

        const [countResult] = await pool.execute(countQuery, countParams);
        return { rows, totalCount: countResult[0].total };
    }
}

export default new InventoryRepository();
