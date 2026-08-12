import { pool } from '../config/db.js';

class SupplierRepository {
    async create(supplierData) {
        const fields = Object.keys(supplierData);
        const values = Object.values(supplierData);
        const placeholders = fields.map(() => '?').join(', ');

        const query = `INSERT INTO suppliers (${fields.join(', ')}) VALUES (${placeholders})`;
        const [result] = await pool.execute(query, values);
        return result.insertId;
    }

    async findAll({ search, supplierType, status, sortBy, sortOrder, limit, offset }) {
        let query = `SELECT * FROM suppliers WHERE 1=1`;
        const params = [];

        if (search) {
            query += ` AND (supplier_name LIKE ? OR contact_person LIKE ? OR mobile LIKE ? OR supplier_code LIKE ?)`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        if (supplierType) {
            query += ` AND supplier_type = ?`;
            params.push(supplierType);
        }

        if (status) {
            query += ` AND status = ?`;
            params.push(status);
        }

        if (sortBy) {
            const allowedSortFields = ['supplier_name', 'created_at', 'supplier_code', 'opening_balance'];
            if (allowedSortFields.includes(sortBy)) {
                query += ` ORDER BY ${sortBy} ${sortOrder === 'desc' ? 'DESC' : 'ASC'}`;
            }
        } else {
            query += ` ORDER BY created_at DESC`;
        }

        query += ` LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

        const [rows] = await pool.execute(query, params);

        let countQuery = `SELECT COUNT(*) as total FROM suppliers WHERE 1=1`;
        const countParams = [];
        
        if (search) {
            countQuery += ` AND (supplier_name LIKE ? OR contact_person LIKE ? OR mobile LIKE ? OR supplier_code LIKE ?)`;
            countParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }
        if (supplierType) {
            countQuery += ` AND supplier_type = ?`;
            countParams.push(supplierType);
        }
        if (status) {
            countQuery += ` AND status = ?`;
            countParams.push(status);
        }

        const [countResult] = await pool.execute(countQuery, countParams);
        const totalCount = countResult[0].total;

        return { rows, totalCount };
    }

    async findById(id) {
        const query = `SELECT * FROM suppliers WHERE supplier_id = ?`;
        const [rows] = await pool.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async findByMobile(mobile) {
        const query = `SELECT * FROM suppliers WHERE mobile = ?`;
        const [rows] = await pool.execute(query, [mobile]);
        return rows.length > 0 ? rows[0] : null;
    }

    async update(id, updateData) {
        const fields = Object.keys(updateData);
        if (fields.length === 0) return 0;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = Object.values(updateData);
        values.push(id);

        const query = `UPDATE suppliers SET ${setClause} WHERE supplier_id = ?`;
        const [result] = await pool.execute(query, values);
        return result.affectedRows;
    }

    async delete(id) {
        const query = `DELETE FROM suppliers WHERE supplier_id = ?`;
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    }
}

export default new SupplierRepository();
