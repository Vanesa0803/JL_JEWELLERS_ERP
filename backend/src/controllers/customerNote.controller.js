import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import CustomerNoteService from '../services/customerNote.service.js';

const addNote = asyncHandler(async (req, res) => {
    const customerId = req.params.customerId;
    const { note } = req.body;

    if (!note) {
        throw new ApiError(400, "Note content is required");
    }

    const createdNote = await CustomerNoteService.addNote(customerId, req.body);
    return res.status(201).json(new ApiResponse(201, createdNote, "Note added successfully"));
});

const getNotes = asyncHandler(async (req, res) => {
    const customerId = req.params.customerId;
    const notes = await CustomerNoteService.getNotesByCustomerId(customerId);
    
    return res.status(200).json(new ApiResponse(200, notes, "Notes retrieved successfully"));
});

const getNoteById = asyncHandler(async (req, res) => {
    const noteId = req.params.noteId;
    const note = await CustomerNoteService.getNoteById(noteId);
    
    return res.status(200).json(new ApiResponse(200, note, "Note retrieved successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
    const noteId = req.params.noteId;
    const updatedNote = await CustomerNoteService.updateNote(noteId, req.body);
    
    return res.status(200).json(new ApiResponse(200, updatedNote, "Note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
    const noteId = req.params.noteId;
    await CustomerNoteService.deleteNote(noteId);
    
    return res.status(200).json(new ApiResponse(200, null, "Note deleted successfully"));
});

export {
    addNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote
};
