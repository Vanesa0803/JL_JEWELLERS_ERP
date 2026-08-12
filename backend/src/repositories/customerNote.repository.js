import { pool } from '../config/db.js';

class CustomerNoteRepository {
    async create(noteData) {
        const fields = Object.keys(noteData);
        const values = Object.values(noteData);
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
        const fields = Object.keys(updateData);
        if (fields.length === 0) return 0;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = Object.values(updateData);
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
