import { pool } from '../../config/db.js';

class CustomerRepository {
    async create(customerData) {
        // Drop undefined values so omitted optional fields fall back to the
        // column default instead of failing with "Bind parameters must
        // not contain undefined".
        const definedEntries = Object.entries(customerData).filter(
            ([, value]) => value !== undefined
        );
        const fields = definedEntries.map(([key]) => key);
        const values = definedEntries.map(([, value]) => value);
        const placeholders = fields.map(() => '?').join(', ');

        const query = `INSERT INTO customers (${fields.join(', ')}) VALUES (${placeholders})`;
        const [result] = await pool.execute(query, values);
        return result.insertId;
    }

    async findAll({ search, customerType, status, sortBy, sortOrder, limit, offset }) {
        let query = `SELECT * FROM customers WHERE 1=1`;
        const params = [];

        if (search) {
            query += ` AND (first_name LIKE ? OR last_name LIKE ? OR mobile LIKE ? OR customer_code LIKE ?)`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        if (customerType) {
            query += ` AND customer_type = ?`;
            params.push(customerType);
        }

        if (status) {
            query += ` AND status = ?`;
            params.push(status);
        }

        if (sortBy) {
            const allowedSortFields = ['first_name', 'created_at', 'customer_code', 'loyalty_points'];
            if (allowedSortFields.includes(sortBy)) {
                query += ` ORDER BY ${sortBy} ${sortOrder === 'desc' ? 'DESC' : 'ASC'}`;
            }
        } else {
            query += ` ORDER BY created_at DESC`;
        }

        query += ` LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

        const [rows] = await pool.execute(query, params);

        // Count total for pagination
        let countQuery = `SELECT COUNT(*) as total FROM customers WHERE 1=1`;
        const countParams = [];
        
        if (search) {
            countQuery += ` AND (first_name LIKE ? OR last_name LIKE ? OR mobile LIKE ? OR customer_code LIKE ?)`;
            countParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }
        if (customerType) {
            countQuery += ` AND customer_type = ?`;
            countParams.push(customerType);
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
        const query = `SELECT * FROM customers WHERE customer_id = ?`;
        const [rows] = await pool.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async findByMobile(mobile) {
        const query = `SELECT * FROM customers WHERE mobile = ?`;
        const [rows] = await pool.execute(query, [mobile]);
        return rows.length > 0 ? rows[0] : null;
    }

    async update(id, updateData) {
        // Partial Update Implementation
        // Drop undefined values: a partial update must leave omitted
        // columns untouched rather than overwriting them with NULL.
        const definedEntries = Object.entries(updateData).filter(
            ([, value]) => value !== undefined
        );
        const fields = definedEntries.map(([key]) => key);
        if (fields.length === 0) return 0; // No fields to update

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = definedEntries.map(([, value]) => value);
        values.push(id); // for WHERE clause

        const query = `UPDATE customers SET ${setClause} WHERE customer_id = ?`;
        const [result] = await pool.execute(query, values);
        return result.affectedRows;
    }

    async delete(id) {
        const query = `DELETE FROM customers WHERE customer_id = ?`;
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    }
}

export default new CustomerRepository();
