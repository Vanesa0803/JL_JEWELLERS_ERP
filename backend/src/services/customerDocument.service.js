import CustomerDocumentRepository from '../repositories/customerDocument.repository.js';
import CustomerRepository from '../repositories/customer.repository.js';
import { ApiError } from '../utils/ApiError.js';
import fs from 'fs';
import path from 'path';

class CustomerDocumentService {
    async addDocument(customerId, data, file) {
        // Validate customer exists
        const customer = await CustomerRepository.findById(customerId);
        if (!customer) {
            // Remove uploaded file since customer doesn't exist
            if (file) fs.unlinkSync(file.path);
            throw new ApiError(404, "Customer not found");
        }

        const documentData = {
            customer_id: customerId,
            document_type: data.document_type,
            document_number: data.document_number,
            remarks: data.remarks
        };

        if (file) {
            documentData.document_file = file.path; // Multer's file.path
        } else if (!data.document_number) {
            // Must have either a file or a document number, ideally both for some types
             throw new ApiError(400, "Either document file or document number is required");
        }

        const docId = await CustomerDocumentRepository.create(documentData);
        return await CustomerDocumentRepository.findById(docId);
    }

    async getDocumentsByCustomerId(customerId) {
        return await CustomerDocumentRepository.findByCustomerId(customerId);
    }

    async getDocumentById(documentId) {
        const document = await CustomerDocumentRepository.findById(documentId);
        if (!document) {
            throw new ApiError(404, "Document not found");
        }
        return document;
    }

    async deleteDocument(documentId) {
        const document = await CustomerDocumentRepository.findById(documentId);
        if (!document) {
            throw new ApiError(404, "Document not found");
        }

        // Delete file from filesystem if it exists
        if (document.document_file && fs.existsSync(document.document_file)) {
            fs.unlinkSync(document.document_file);
        }

        const affectedRows = await CustomerDocumentRepository.delete(documentId);
        return affectedRows > 0;
    }
}

export default new CustomerDocumentService();
