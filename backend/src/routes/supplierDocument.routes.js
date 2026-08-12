import { Router } from "express";
import { uploadSupplierDocument } from "../config/multer.js";
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  viewDocument,
  downloadDocument,
  deleteDocument,
} from "../controllers/supplierDocument.controller.js";

const router = Router();

// Base route is /api/v1/suppliers

// POST /api/v1/suppliers/:supplierId/documents
// GET /api/v1/suppliers/:supplierId/documents
router
  .route("/:supplierId/documents")
  .post(uploadSupplierDocument.single("document_file"), uploadDocument)
  .get(getDocuments);

// GET /api/v1/suppliers/documents/:documentId
// DELETE /api/v1/suppliers/documents/:documentId
router
  .route("/documents/:documentId")
  .get(getDocumentById)
  .delete(deleteDocument);

// GET /api/v1/suppliers/documents/:documentId/view
router.route("/documents/:documentId/view").get(viewDocument);

// GET /api/v1/suppliers/documents/:documentId/download
router.route("/documents/:documentId/download").get(downloadDocument);

export default router;
