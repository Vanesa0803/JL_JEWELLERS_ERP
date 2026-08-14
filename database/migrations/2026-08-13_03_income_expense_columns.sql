-- =====================================================================
--  Migration 2026-08-13_03
--  Align income and expenses with the code, and with each other
-- =====================================================================
--
--  WHY
--  ---
--  income and expenses are the same kind of record, and the code treats them
--  as a matched pair. The schema did not:
--
--    expenses  expense_id, expense_type,   amount, expense_date,  remarks
--    income    income_id,  income_source,  amount, received_date, remarks
--
--  The code writes `income_type` / `income_date` (mirroring expenses) and also
--  writes `payment_method` and `created_by` to BOTH, neither of which exists.
--  That is why GET /income/history failed with "Unknown column 'income_date'"
--  (S2-16).
--
--  Renaming income's two columns rather than changing the code leaves the two
--  tables symmetric, which is what both the code and common sense expect:
--
--    expenses  expense_id, expense_type, amount, payment_method, expense_date, remarks, created_by
--    income    income_id,  income_type,  amount, payment_method, income_date,  remarks, created_by
--
--  SAFETY
--  ------
--  income is EMPTY (0 rows), so the renames cannot lose data. The added
--  columns are additive and nullable, so existing expense rows are unaffected.
--  Guarded, so re-running is harmless.
--
--  TO APPLY
--  --------
--    mysql -u root -p jl_jewellers_erp < database/migrations/2026-08-13_03_income_expense_columns.sql
-- =====================================================================

SET @schema := DATABASE();

-- --- income.income_source -> income_type ---------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 1,
        'ALTER TABLE income CHANGE COLUMN income_source income_type VARCHAR(100) NULL',
        'SELECT ''income.income_source already renamed — skipped'' AS note'
    )
    FROM information_schema.columns
    WHERE table_schema = @schema AND table_name = 'income' AND column_name = 'income_source'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- --- income.received_date -> income_date ---------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 1,
        'ALTER TABLE income CHANGE COLUMN received_date income_date DATE NULL',
        'SELECT ''income.received_date already renamed — skipped'' AS note'
    )
    FROM information_schema.columns
    WHERE table_schema = @schema AND table_name = 'income' AND column_name = 'received_date'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- --- income.payment_method ------------------------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE income ADD COLUMN payment_method VARCHAR(50) NULL AFTER amount',
        'SELECT ''income.payment_method already exists — skipped'' AS note'
    )
    FROM information_schema.columns
    WHERE table_schema = @schema AND table_name = 'income' AND column_name = 'payment_method'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- --- income.created_by ----------------------------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE income ADD COLUMN created_by INT NULL',
        'SELECT ''income.created_by already exists — skipped'' AS note'
    )
    FROM information_schema.columns
    WHERE table_schema = @schema AND table_name = 'income' AND column_name = 'created_by'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- --- expenses.payment_method ----------------------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE expenses ADD COLUMN payment_method VARCHAR(50) NULL AFTER amount',
        'SELECT ''expenses.payment_method already exists — skipped'' AS note'
    )
    FROM information_schema.columns
    WHERE table_schema = @schema AND table_name = 'expenses' AND column_name = 'payment_method'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- --- expenses.created_by --------------------------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE expenses ADD COLUMN created_by INT NULL',
        'SELECT ''expenses.created_by already exists — skipped'' AS note'
    )
    FROM information_schema.columns
    WHERE table_schema = @schema AND table_name = 'expenses' AND column_name = 'created_by'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
