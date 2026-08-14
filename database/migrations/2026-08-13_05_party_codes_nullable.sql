-- =====================================================================
--  Migration 2026-08-13_05
--  Allow customer_code and supplier_code to be NULL momentarily
-- =====================================================================
--
--  WHY
--  ---
--  Creating a customer failed with:
--      Field 'customer_code' doesn't have a default value
--
--  The service derives the code FROM the new row's id, so it cannot know the
--  code until the insert has happened:
--
--      delete data.customer_code;                          -- caller cannot set it
--      const id = await CustomerRepository.create(data);    -- insert
--      const code = `CUS${String(id).padStart(6, '0')}`;    -- derive from id
--      await CustomerRepository.update(id, { customer_code: code });
--
--  That is a good design — codes come out sequential and unique by
--  construction, and a client cannot invent its own. But it needs the column
--  to tolerate being empty for the moment between the INSERT and the UPDATE,
--  and the column was NOT NULL with no default.
--
--  Suppliers use exactly the same pattern, so both are changed together.
--  Products are unaffected: product_code is supplied by the caller and
--  validated, so it is never momentarily empty.
--
--  UNIQUE is kept. MySQL permits multiple NULLs in a unique index, so
--  concurrent inserts are fine.
--
--  IF SOMETHING GOES WRONG
--  -----------------------
--  If the UPDATE ever fails after the INSERT, a row is left with a NULL code.
--  Because the code is purely derived from the id, it can always be rebuilt:
--
--      UPDATE customers SET customer_code = CONCAT('CUS', LPAD(customer_id, 6, '0'))
--       WHERE customer_code IS NULL;
--      UPDATE suppliers SET supplier_code = CONCAT('SUP', LPAD(supplier_id, 6, '0'))
--       WHERE supplier_code IS NULL;
--
--  A tidier long-term option is a STORED GENERATED column, which removes the
--  second write entirely and makes a wrong code impossible. That would mean
--  changing both services, so it is left as a future improvement rather than
--  done during a merge.
--
--  SAFETY
--  ------
--  Relaxing NOT NULL cannot invalidate existing rows — every current row
--  already has a code. Re-runnable.
--
--  TO APPLY
--  --------
--    mysql -u root -p jl_jewellers_erp < database/migrations/2026-08-13_05_party_codes_nullable.sql
-- =====================================================================

SET @schema := DATABASE();

-- --- customers.customer_code ---------------------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 1,
        'ALTER TABLE customers MODIFY COLUMN customer_code VARCHAR(15) NULL',
        'SELECT ''customers.customer_code already nullable — skipped'' AS note'
    )
    FROM information_schema.columns
    WHERE table_schema = @schema
      AND table_name   = 'customers'
      AND column_name  = 'customer_code'
      AND is_nullable  = 'NO'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- --- suppliers.supplier_code ---------------------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 1,
        'ALTER TABLE suppliers MODIFY COLUMN supplier_code VARCHAR(15) NULL',
        'SELECT ''suppliers.supplier_code already nullable — skipped'' AS note'
    )
    FROM information_schema.columns
    WHERE table_schema = @schema
      AND table_name   = 'suppliers'
      AND column_name  = 'supplier_code'
      AND is_nullable  = 'NO'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
