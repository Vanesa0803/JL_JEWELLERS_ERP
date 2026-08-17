import { pool } from '../../config/db.js';
import { assertColumns } from '../../utils/columnGuard.js';

class CustomerDocumentRepository {
    async create(documentData) {
        // Drop undefined values so omitted optional fields fall back to the
        // column default instead of failing with "Bind parameters must
        // not contain undefined".
        const definedEntries = Object.entries(documentData).filter(
            ([, value]) => value !== undefined
        );
        const fields = definedEntries.map(([key]) => key);
        await assertColumns('customer_documents', fields);
        const values = definedEntries.map(([, value]) => value);
        const placeholders = fields.map(() => '?').join(', ');

        const query = `INSERT INTO customer_documents (${fields.join(', ')}) VALUES (${placeholders})`;
        const [result] = await pool.execute(query, values);
        return result.insertId;
    }

    async findByCustomerId(customerId) {
        const query = `SELECT * FROM customer_documents WHERE customer_id = ? AND status = 'Active' ORDER BY created_at DESC`;
        const [rows] = await pool.execute(query, [customerId]);
        return rows;
    }

    async findById(documentId) {
        const query = `SELECT * FROM customer_documents WHERE document_id = ?`;
        const [rows] = await pool.execute(query, [documentId]);
        return rows.length > 0 ? rows[0] : null;
    }

    async delete(documentId) {
        const query = `DELETE FROM customer_documents WHERE document_id = ?`;
        const [result] = await pool.execute(query, [documentId]);
        return result.affectedRows;
    }
}

export default new CustomerDocumentRepository();
