import { pool } from '../../config/db.js';
import { assertColumns } from '../../utils/columnGuard.js';

class CustomerNoteRepository {
    async create(noteData) {
        // Drop undefined values so omitted optional fields fall back to the
        // column default instead of failing with "Bind parameters must
        // not contain undefined".
        const definedEntries = Object.entries(noteData).filter(
            ([, value]) => value !== undefined
        );
        const fields = definedEntries.map(([key]) => key);
        await assertColumns('customer_notes', fields);
        const values = definedEntries.map(([, value]) => value);
        const placeholders = fields.map(() => '?').join(', ');

        const query = `INSERT INTO customer_notes (${fields.join(', ')}) VALUES (${placeholders})`;
        const [result] = await pool.execute(query, values);
        return result.insertId;
    }

    async findByCustomerId(customerId) {
        const query = `SELECT * FROM customer_notes WHERE customer_id = ? ORDER BY created_at DESC`;
        const [rows] = await pool.execute(query, [customerId]);
        return rows;
    }

    async findById(noteId) {
        const query = `SELECT * FROM customer_notes WHERE note_id = ?`;
        const [rows] = await pool.execute(query, [noteId]);
        return rows.length > 0 ? rows[0] : null;
    }

    async update(noteId, updateData) {
        // Drop undefined values: a partial update must leave omitted
        // columns untouched rather than overwriting them with NULL.
        const definedEntries = Object.entries(updateData).filter(
            ([, value]) => value !== undefined
        );
        const fields = definedEntries.map(([key]) => key);
        await assertColumns('customer_notes', fields);
        if (fields.length === 0) return 0;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = definedEntries.map(([, value]) => value);
        values.push(noteId);

        const query = `UPDATE customer_notes SET ${setClause} WHERE note_id = ?`;
        const [result] = await pool.execute(query, values);
        return result.affectedRows;
    }

    async delete(noteId) {
        const query = `DELETE FROM customer_notes WHERE note_id = ?`;
        const [result] = await pool.execute(query, [noteId]);
        return result.affectedRows;
    }
}

export default new CustomerNoteRepository();
