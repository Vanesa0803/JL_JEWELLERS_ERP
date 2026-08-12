import { pool } from '../config/db.js';

class InventoryAnalyticsRepository {
    async getMetalStock(metalKeyword) {
        const query = `
            SELECT 
                p.product_id, 
                p.product_code, 
                p.product_name, 
                SUM(i.available_quantity) as total_quantity,
                SUM(i.available_quantity * COALESCE(pv.net_weight, 0)) as total_net_weight
            FROM inventory i
            JOIN products p ON i.product_id = p.product_id
            JOIN metal_types mt ON p.metal_type_id = mt.metal_type_id
            LEFT JOIN product_variants pv ON p.product_id = pv.product_id
            WHERE mt.metal_name LIKE ? AND i.available_quantity > 0
            GROUP BY p.product_id, p.product_code, p.product_name
            ORDER BY total_quantity DESC
        `;
        const [rows] = await pool.execute(query, [`%${metalKeyword}%`]);
        return rows;
    }

    async getStoneStock() {
        const query = `
            SELECT 
                p.product_id, 
                p.product_code, 
                p.product_name, 
                SUM(i.available_quantity) as total_quantity,
                SUM(i.available_quantity * COALESCE(pv.stone_weight, 0)) as total_stone_weight
            FROM inventory i
            JOIN products p ON i.product_id = p.product_id
            JOIN stone_types st ON p.stone_type_id = st.stone_type_id
            LEFT JOIN product_variants pv ON p.product_id = pv.product_id
            WHERE i.available_quantity > 0
            GROUP BY p.product_id, p.product_code, p.product_name
            ORDER BY total_quantity DESC
        `;
        const [rows] = await pool.execute(query);
        return rows;
    }

    async getDeadStock(months = 6) {
        const query = `
            SELECT 
                i.inventory_id,
                p.product_code, 
                p.product_name, 
                i.available_quantity,
                i.last_stock_update
            FROM inventory i
            JOIN products p ON i.product_id = p.product_id
            WHERE i.available_quantity > 0 
            AND i.last_stock_update < DATE_SUB(NOW(), INTERVAL ? MONTH)
            ORDER BY i.last_stock_update ASC
        `;
        const [rows] = await pool.execute(query, [months]);
        return rows;
    }

    async getFastMoving() {
        const query = `
            SELECT 
                p.product_id, 
                p.product_code, 
                p.product_name, 
                SUM(ABS(sm.quantity)) as total_sold
            FROM stock_movements sm
            JOIN products p ON sm.product_id = p.product_id
            WHERE sm.movement_type = 'Sale' 
            AND sm.movement_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY p.product_id, p.product_code, p.product_name
            HAVING total_sold > 5
            ORDER BY total_sold DESC
            LIMIT 50
        `;
        const [rows] = await pool.execute(query);
        return rows;
    }

    async getSlowMoving() {
        const query = `
            SELECT 
                p.product_id, 
                p.product_code, 
                p.product_name, 
                COALESCE(SUM(ABS(sm.quantity)), 0) as total_sold
            FROM inventory i
            JOIN products p ON i.product_id = p.product_id
            LEFT JOIN stock_movements sm ON sm.product_id = i.product_id 
                AND sm.movement_type = 'Sale' 
                AND sm.movement_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            WHERE i.available_quantity > 0
            GROUP BY p.product_id, p.product_code, p.product_name
            HAVING total_sold <= 2
            ORDER BY total_sold ASC
            LIMIT 50
        `;
        const [rows] = await pool.execute(query);
        return rows;
    }

    async getOverstock() {
        const query = `
            SELECT 
                i.inventory_id,
                p.product_code, 
                p.product_name, 
                i.available_quantity,
                i.maximum_stock
            FROM inventory i
            JOIN products p ON i.product_id = p.product_id
            WHERE i.maximum_stock > 0 
            AND i.available_quantity > i.maximum_stock
            ORDER BY i.available_quantity DESC
        `;
        const [rows] = await pool.execute(query);
        return rows;
    }

    async getStockAging() {
        const query = `
            SELECT 
                SUM(CASE WHEN DATEDIFF(NOW(), last_stock_update) <= 30 THEN available_quantity ELSE 0 END) as '0_to_30_days',
                SUM(CASE WHEN DATEDIFF(NOW(), last_stock_update) BETWEEN 31 AND 90 THEN available_quantity ELSE 0 END) as '31_to_90_days',
                SUM(CASE WHEN DATEDIFF(NOW(), last_stock_update) BETWEEN 91 AND 180 THEN available_quantity ELSE 0 END) as '91_to_180_days',
                SUM(CASE WHEN DATEDIFF(NOW(), last_stock_update) > 180 THEN available_quantity ELSE 0 END) as '180_plus_days'
            FROM inventory
            WHERE available_quantity > 0
        `;
        const [rows] = await pool.execute(query);
        return rows[0];
    }
}

export default new InventoryAnalyticsRepository();
