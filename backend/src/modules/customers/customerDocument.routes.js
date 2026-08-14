import { Router } from 'express';
import { uploadCustomerDocument } from '../../config/multer.js';
import {
    uploadDocument,
    getDocuments,
    getDocumentById,
    viewDocument,
    downloadDocument,
    deleteDocument
} from './customerDocument.controller.js';

const router = Router();

// Base route is /api/v1/customers

// POST /api/v1/customers/:customerId/documents
// GET /api/v1/customers/:customerId/documents
router.route('/:customerId/documents')
    .post(uploadCustomerDocument.single('document_file'), uploadDocument)
    .get(getDocuments);

// GET /api/v1/customers/documents/:documentId
// DELETE /api/v1/customers/documents/:documentId
router.route('/documents/:documentId')
    .get(getDocumentById)
    .delete(deleteDocument);

// GET /api/v1/customers/documents/:documentId/view
router.route('/documents/:documentId/view')
    .get(viewDocument);

// GET /api/v1/customers/documents/:documentId/download
router.route('/documents/:documentId/download')
    .get(downloadDocument);

export default router;
