import SupplierDocumentRepository from "./supplierDocument.repository.js";
import SupplierRepository from "./supplier.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import fs from "fs";

class SupplierDocumentService {
  async addDocument(supplierId, data, file) {
    if (!supplierId) {
      if (file) fs.unlinkSync(file.path);
      throw new ApiError(400, "supplierId is required in URL");
    }

    const supplier = await SupplierRepository.findById(supplierId);
    if (!supplier) {
      if (file) fs.unlinkSync(file.path);
      throw new ApiError(404, "Supplier not found");
    }

    const documentData = {
      supplier_id: supplierId,
      document_type: data.document_type,
      document_number: data.document_number,
      remarks: data.remarks,
    };

    if (file) {
      documentData.document_file = file.path;
    } else if (!data.document_number) {
      throw new ApiError(
        400,
        "Either document file or document number is required",
      );
    }

    const docId = await SupplierDocumentRepository.create(documentData);
    return await SupplierDocumentRepository.findById(docId);
  }

  async getDocumentsBySupplierId(supplierId) {
    return await SupplierDocumentRepository.findBySupplierId(supplierId);
  }

  async getDocumentById(documentId) {
    const document = await SupplierDocumentRepository.findById(documentId);
    if (!document) {
      throw new ApiError(404, "Document not found");
    }
    return document;
  }

  async deleteDocument(documentId) {
    const document = await SupplierDocumentRepository.findById(documentId);
    if (!document) {
      throw new ApiError(404, "Document not found");
    }

    if (document.document_file && fs.existsSync(document.document_file)) {
      fs.unlinkSync(document.document_file);
    }

    const affectedRows = await SupplierDocumentRepository.delete(documentId);
    return affectedRows > 0;
  }
}

export default new SupplierDocumentService();
