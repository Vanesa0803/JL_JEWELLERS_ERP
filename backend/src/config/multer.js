import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Common storage configuration generator
const createStorage = (destinationPathBuilder) => multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = destinationPathBuilder(req, file);
        // Create directory if it doesn't exist
        fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// For customer documents: uploads/customers/customer_<id>/
const customerDocumentStorage = createStorage((req, file) => {
    const customerId = req.params.customerId;
    return `uploads/customers/customer_${customerId}/`;
});

// For supplier documents: uploads/suppliers/supplier_<id>/
const supplierDocumentStorage = createStorage((req, file) => {
    // Supplier API now passes supplierId in URL parameters
    const supplierId = req.params.supplierId || req.body.supplier_id;
    return `uploads/suppliers/supplier_${supplierId}/`;
});

// For product images: uploads/products/product_<id>/
const productImageStorage = createStorage((req, file) => {
    const productId = req.body.product_id || req.params.productId;
    return `uploads/products/product_${productId}/`;
});

export const uploadCustomerDocument = multer({ storage: customerDocumentStorage });
export const uploadSupplierDocument = multer({ storage: supplierDocumentStorage });
export const uploadProductImage = multer({ storage: productImageStorage });
