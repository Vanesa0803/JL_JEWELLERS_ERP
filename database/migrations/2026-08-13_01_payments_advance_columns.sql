-- =====================================================================
--  Migration 2026-08-13_01
--  Add the two columns the advance-payment feature needs
-- =====================================================================
--
--  WHY
--  ---
--  The advance-payment code was fully written (createAdvancePayment,
--  createAdvanceAdjustmentPayment, adjustAdvancePayment, getCustomerAdvance)
--  but queried two columns that were never added to the table, so every
--  advance endpoint failed with "Unknown column 'p.customer_id'".
--
--  This completes an intended design rather than adding a new one. The table
--  already allows bill_id to be NULL, and payment_type already includes
--  'Advance' as an enum value — both only make sense if a payment can exist
--  without a bill, attached to a customer instead.
--
--  customer_id   an advance is taken from a CUSTOMER before any bill exists,
--                so it cannot be reached by joining through bill_id.
--                NULL for ordinary bill payments, where the bill knows the
--                customer.
--
--  is_adjusted   marks an advance as consumed once it has been applied to a
--                bill, so the same advance cannot be spent twice.
--
--  SAFETY
--  ------
--  Additive only. No existing column is altered or dropped and no row is
--  rewritten. Existing payments get customer_id = NULL and is_adjusted = 0,
--  which is correct for them: they are bill payments and none is an
--  unconsumed advance.
--
--  Re-runnable: guarded so applying it twice is harmless.
--
--  TO APPLY
--  --------
--    mysql -u root -p jl_jewellers_erp < database/migrations/2026-08-13_01_payments_advance_columns.sql
-- =====================================================================

SET @schema := DATABASE();

-- --- payments.customer_id -------------------------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE payments
            ADD COLUMN customer_id INT NULL DEFAULT NULL AFTER bill_id',
        'SELECT ''payments.customer_id already exists — skipped'' AS note'
    )
    FROM information_schema.columns
    WHERE table_schema = @schema
      AND table_name   = 'payments'
      AND column_name  = 'customer_id'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- --- payments.is_adjusted -------------------------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE payments
            ADD COLUMN is_adjusted TINYINT(1) NOT NULL DEFAULT 0 AFTER payment_type',
        'SELECT ''payments.is_adjusted already exists — skipped'' AS note'
    )
    FROM information_schema.columns
    WHERE table_schema = @schema
      AND table_name   = 'payments'
      AND column_name  = 'is_adjusted'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- --- foreign key to customers ---------------------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE payments
            ADD CONSTRAINT fk_payments_customer
            FOREIGN KEY (customer_id) REFERENCES customers(customer_id)',
        'SELECT ''fk_payments_customer already exists — skipped'' AS note'
    )
    FROM information_schema.table_constraints
    WHERE table_schema    = @schema
      AND table_name      = 'payments'
      AND constraint_name = 'fk_payments_customer'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- --- index for "unconsumed advances for this customer" --------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE INDEX idx_payments_customer_advance
            ON payments (customer_id, payment_type, is_adjusted)',
        'SELECT ''idx_payments_customer_advance already exists — skipped'' AS note'
    )
    FROM information_schema.statistics
    WHERE table_schema = @schema
      AND table_name   = 'payments'
      AND index_name   = 'idx_payments_customer_advance'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
