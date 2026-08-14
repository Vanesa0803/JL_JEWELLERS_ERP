-- =====================================================================
--  Migration 2026-08-13_06
--  Give supplier_documents the same status column customer_documents has
-- =====================================================================
--
--  WHY
--  ---
--  GET /suppliers/:id/documents failed with:
--      Unknown column 'status' in 'where clause'
--
--  customer_documents and supplier_documents are the same kind of record and
--  the code treats them as a matched pair — both list only active documents,
--  both soft-delete by setting status rather than removing the row. But the
--  schema only gave the column to one of them:
--
--      customer_documents  ... document_file, remarks, status, created_at ...
--      supplier_documents  ... document_file, remarks,         created_at ...
--
--  Same shape of problem as income vs expenses (migration _03): two parallel
--  tables that drifted apart. Adding the column restores the symmetry rather
--  than stripping the soft-delete from the supplier side, which would have
--  meant deleting real KYC documents outright.
--
--  Existing rows default to 'Active', which is correct — nothing has been
--  soft-deleted yet.
--
--  SAFETY
--  ------
--  Additive, with a default, so existing rows stay valid and visible.
--  Guarded, so re-running is harmless.
--
--  TO APPLY
--  --------
--    mysql -u root -p jl_jewellers_erp < database/migrations/2026-08-13_06_supplier_documents_status.sql
-- =====================================================================

SET @schema := DATABASE();

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE supplier_documents
            ADD COLUMN status ENUM(''Active'',''Inactive'') NOT NULL DEFAULT ''Active''
            AFTER remarks',
        'SELECT ''supplier_documents.status already exists — skipped'' AS note'
    )
    FROM information_schema.columns
    WHERE table_schema = @schema
      AND table_name   = 'supplier_documents'
      AND column_name  = 'status'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
