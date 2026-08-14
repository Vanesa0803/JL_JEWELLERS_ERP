import { Router } from 'express';
import {
    addNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote
} from './customerNote.controller.js';

const router = Router();

// Base route is /api/v1/customers

// POST /api/v1/customers/:customerId/notes
// GET /api/v1/customers/:customerId/notes
router.route('/:customerId/notes')
    .post(addNote)
    .get(getNotes);

// GET /api/v1/customers/notes/:noteId
// PUT /api/v1/customers/notes/:noteId
// DELETE /api/v1/customers/notes/:noteId
router.route('/notes/:noteId')
    .get(getNoteById)
    .put(updateNote)
    .delete(deleteNote);

export default router;
