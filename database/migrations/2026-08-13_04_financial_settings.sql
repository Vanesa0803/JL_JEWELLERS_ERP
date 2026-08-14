-- =====================================================================
--  Migration 2026-08-13_04
--  Finish the financial-settings table, and give it a default row
-- =====================================================================
--
--  WHY
--  ---
--  The financial-security code wrote max_discount_percent and
--  max_rate_change_percent to a `financial_security` table that has never
--  existed (S0-8).
--
--  Unlike the cash book, the fix here is mostly a rename — the real table is
--  `financial_pin` — but the two settings columns do NOT belong on it. A PIN
--  record holds a hash; a discount ceiling is a business setting.
--
--  The schema already had the right home: `financial_settings` exists and
--  ALREADY has max_discount_percent, alongside default_gst_metal,
--  default_gst_making, default_making_charge and invoice_prefix. The code
--  simply did not know about it. So the settings writes are repointed there,
--  and only the one genuinely missing column is added.
--
--  WHAT CHANGES
--  ------------
--    + financial_settings.max_rate_change_percent
--    + one default row, so the settings UPDATE has something to update
--
--  About that default row: financial_settings is a singleton — the code does
--  `UPDATE ... WHERE setting_id = 1`. With an empty table that updates zero
--  rows and silently does nothing. The row carries conservative defaults that
--  match the values currently hardcoded in the billing calculator (3% GST on
--  metal, 5% on making charges).
--
--  SAFETY
--  ------
--  financial_settings is EMPTY (0 rows). Additive, and guarded so re-running
--  is harmless — the default row is only inserted if the table is empty.
--
--  TO APPLY
--  --------
--    mysql -u root -p jl_jewellers_erp < database/migrations/2026-08-13_04_financial_settings.sql
-- =====================================================================

SET @schema := DATABASE();

-- --- financial_settings.max_rate_change_percent ---------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE financial_settings
            ADD COLUMN max_rate_change_percent DECIMAL(5,2) NULL DEFAULT NULL
            AFTER max_discount_percent',
        'SELECT ''financial_settings.max_rate_change_percent already exists — skipped'' AS note'
    )
    FROM information_schema.columns
    WHERE table_schema = @schema
      AND table_name   = 'financial_settings'
      AND column_name  = 'max_rate_change_percent'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- --- the singleton settings row -------------------------------------------
INSERT INTO financial_settings (
    setting_id,
    default_gst_metal,
    default_gst_making,
    default_making_charge,
    max_discount_percent,
    max_rate_change_percent,
    invoice_prefix,
    company_currency
)
SELECT
    1,
    3.00,    -- matches the 3% metal GST hardcoded in the billing calculator
    5.00,    -- matches the 5% making-charge GST
    0.00,
    10.00,   -- conservative default discount ceiling
    5.00,    -- conservative default metal-rate change ceiling
    'INV',
    'INR'
WHERE NOT EXISTS (SELECT 1 FROM financial_settings);
