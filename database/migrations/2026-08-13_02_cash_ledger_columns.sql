-- =====================================================================
--  Migration 2026-08-13_02
--  Bring cash_ledger up to the shape the cash-book code writes
-- =====================================================================
--
--  WHY
--  ---
--  The finance code writes to a table called `cash_book` that has never
--  existed. This was originally logged as a simple rename to `cash_ledger`
--  (S0-7), but checking the two side by side showed that is wrong:
--
--    cash_ledger has : cash_entry_id, transaction_date, transaction_type,
--                      amount, description, created_at
--    the code writes : transaction_type, source, reference_id, customer_id,
--                      amount, remarks, created_by
--
--  Only `transaction_type` and `amount` overlap. A find-and-replace would
--  have failed on the first insert.
--
--  WHICH NAME WINS
--  ---------------
--  `cash_ledger` — it belongs to a consistent family already in the schema
--  (bank_ledger, customer_ledger, supplier_ledger, expense_ledger), whereas
--  `cash_book` sits outside it. The 9 code references were changed instead.
--
--  WHAT CHANGES
--  ------------
--    + source        where the entry came from (Bill, Advance, Expense, ...)
--    + reference_id  the id of that source record
--    + customer_id   the customer involved, when there is one
--    + created_by    the employee who recorded it
--    ~ description -> remarks   (the name the code uses)
--
--  SAFETY
--  ------
--  cash_ledger is EMPTY (0 rows) and referenced nowhere in the codebase, so
--  nothing can be disturbed. The rename cannot lose data for the same reason.
--  Guarded, so re-running is harmless.
--
--  TO APPLY
--  --------
--    mysql -u root -p jl_jewellers_erp < database/migrations/2026-08-13_02_cash_ledger_columns.sql
-- =====================================================================

SET @schema := DATABASE();

-- --- description -> remarks ----------------------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 1,
        'ALTER TABLE cash_ledger CHANGE COLUMN description remarks TEXT NULL',
        'SELECT ''cash_ledger.description already renamed — skipped'' AS note'
    )
    FROM information_schema.columns
    WHERE table_schema = @schema
      AND table_name   = 'cash_ledger'
      AND column_name  = 'description'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- --- source ---------------------------------------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE cash_ledger ADD COLUMN source VARCHAR(50) NULL AFTER transaction_type',
        'SELECT ''cash_ledger.source already exists — skipped'' AS note'
    )
    FROM information_schema.columns
    WHERE table_schema = @schema AND table_name = 'cash_ledger' AND column_name = 'source'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- --- reference_id ---------------------------------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE cash_ledger ADD COLUMN reference_id INT NULL AFTER source',
        'SELECT ''cash_ledger.reference_id already exists — skipped'' AS note'
    )
    FROM information_schema.columns
    WHERE table_schema = @schema AND table_name = 'cash_ledger' AND column_name = 'reference_id'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- --- customer_id ----------------------------------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE cash_ledger ADD COLUMN customer_id INT NULL AFTER reference_id',
        'SELECT ''cash_ledger.customer_id already exists — skipped'' AS note'
    )
    FROM information_schema.columns
    WHERE table_schema = @schema AND table_name = 'cash_ledger' AND column_name = 'customer_id'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- --- created_by -----------------------------------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE cash_ledger ADD COLUMN created_by INT NULL',
        'SELECT ''cash_ledger.created_by already exists — skipped'' AS note'
    )
    FROM information_schema.columns
    WHERE table_schema = @schema AND table_name = 'cash_ledger' AND column_name = 'created_by'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- --- foreign keys ---------------------------------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE cash_ledger ADD CONSTRAINT fk_cash_ledger_customer
            FOREIGN KEY (customer_id) REFERENCES customers(customer_id)',
        'SELECT ''fk_cash_ledger_customer already exists — skipped'' AS note'
    )
    FROM information_schema.table_constraints
    WHERE table_schema = @schema AND table_name = 'cash_ledger'
      AND constraint_name = 'fk_cash_ledger_customer'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE cash_ledger ADD CONSTRAINT fk_cash_ledger_created_by
            FOREIGN KEY (created_by) REFERENCES employees(employee_id)',
        'SELECT ''fk_cash_ledger_created_by already exists — skipped'' AS note'
    )
    FROM information_schema.table_constraints
    WHERE table_schema = @schema AND table_name = 'cash_ledger'
      AND constraint_name = 'fk_cash_ledger_created_by'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- --- index for the cash-in / cash-out totals the dashboard runs -----------
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE INDEX idx_cash_ledger_type_date ON cash_ledger (transaction_type, transaction_date)',
        'SELECT ''idx_cash_ledger_type_date already exists — skipped'' AS note'
    )
    FROM information_schema.statistics
    WHERE table_schema = @schema AND table_name = 'cash_ledger'
      AND index_name = 'idx_cash_ledger_type_date'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
