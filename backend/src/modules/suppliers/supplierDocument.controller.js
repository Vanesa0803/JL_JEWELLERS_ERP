import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import SupplierDocumentService from "./supplierDocument.service.js";
import path from "path";

const uploadDocument = asyncHandler(async (req, res) => {
  const supplierId = req.params.supplierId;
  const { document_type, document_number, remarks } = req.body;

  if (!document_type) {
    throw new ApiError(400, "Document type is required");
  }

  const document = await SupplierDocumentService.addDocument(
    supplierId,
    { document_type, document_number, remarks },
    req.file,
  );
  return res
    .status(201)
    .json(
      new ApiResponse(201, document, "Supplier document uploaded successfully"),
    );
});

const getDocuments = asyncHandler(async (req, res) => {
  const supplierId = req.params.supplierId;
  const documents =
    await SupplierDocumentService.getDocumentsBySupplierId(supplierId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        documents,
        "Supplier documents retrieved successfully",
      ),
    );
});

const getDocumentById = asyncHandler(async (req, res) => {
  const documentId = req.params.documentId;
  const document = await SupplierDocumentService.getDocumentById(documentId);

  return res
    .status(200)
    .json(new ApiResponse(200, document, "Document retrieved successfully"));
});

const viewDocument = asyncHandler(async (req, res) => {
  const documentId = req.params.documentId;
  const document = await SupplierDocumentService.getDocumentById(documentId);

  if (!document.document_file) {
    throw new ApiError(404, "No file associated with this document");
  }

  const absolutePath = path.resolve(document.document_file);
  res.sendFile(absolutePath);
});

const downloadDocument = asyncHandler(async (req, res) => {
  const documentId = req.params.documentId;
  const document = await SupplierDocumentService.getDocumentById(documentId);

  if (!document.document_file) {
    throw new ApiError(404, "No file associated with this document");
  }

  const absolutePath = path.resolve(document.document_file);
  res.download(absolutePath);
});

const deleteDocument = asyncHandler(async (req, res) => {
  const documentId = req.params.documentId;
  await SupplierDocumentService.deleteDocument(documentId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Document deleted successfully"));
});

export {
  uploadDocument,
  getDocuments,
  getDocumentById,
  viewDocument,
  downloadDocument,
  deleteDocument,
};
