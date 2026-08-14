import CustomerNoteRepository from './customerNote.repository.js';
import CustomerRepository from './customer.repository.js';
import { ApiError } from '../../utils/ApiError.js';

class CustomerNoteService {
    async addNote(customerId, data) {
        const customer = await CustomerRepository.findById(customerId);
        if (!customer) {
            throw new ApiError(404, "Customer not found");
        }

        const noteData = {
            customer_id: customerId,
            note: data.note
        };

        if (data.status) {
            noteData.status = data.status;
        }

        const noteId = await CustomerNoteRepository.create(noteData);
        return await CustomerNoteRepository.findById(noteId);
    }

    async getNotesByCustomerId(customerId) {
        return await CustomerNoteRepository.findByCustomerId(customerId);
    }

    async getNoteById(noteId) {
        const note = await CustomerNoteRepository.findById(noteId);
        if (!note) {
            throw new ApiError(404, "Note not found");
        }
        return note;
    }

    async updateNote(noteId, data) {
        const existingNote = await CustomerNoteRepository.findById(noteId);
        if (!existingNote) {
            throw new ApiError(404, "Note not found");
        }

        const updatePayload = {};
        if (data.note !== undefined) updatePayload.note = data.note;
        if (data.status !== undefined) updatePayload.status = data.status;

        const affectedRows = await CustomerNoteRepository.update(noteId, updatePayload);
        if (affectedRows === 0) {
            throw new ApiError(500, "Failed to update note");
        }

        return await CustomerNoteRepository.findById(noteId);
    }

    async deleteNote(noteId) {
        const note = await CustomerNoteRepository.findById(noteId);
        if (!note) {
            throw new ApiError(404, "Note not found");
        }

        const affectedRows = await CustomerNoteRepository.delete(noteId);
        return affectedRows > 0;
    }
}

export default new CustomerNoteService();
