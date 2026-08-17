-- =====================================================================
--  Migration 2026-08-17_09
--  Make invoice_sequence usable as a real GST invoice counter
-- =====================================================================
--
--  WHY
--  ---
--  Bills were numbered with "INV-" + Date.now() (S1-8):
--
--      INV-1786939073522
--
--  That is a millisecond timestamp. It is unique, and that is the only
--  property it has. GST law requires the invoice number of a tax invoice to
--  be a CONSECUTIVE SERIAL NUMBER, unique within a financial year. A
--  timestamp is not consecutive and carries no series, so every bill the shop
--  has issued this way is non-compliant on its face — and the gaps cannot be
--  explained to an auditor after the fact, because there is no sequence to
--  explain.
--
--  An `invoice_sequence` table already existed for exactly this and had never
--  been written to. It was missing the one constraint that makes it safe to
--  use:
--
--      sequence_id          int      PRI
--      financial_year       varchar(9)        <-- no unique key
--      last_invoice_number  int      default 0
--
--  Without a unique key on financial_year, two concurrent bills can each
--  insert their own row for the same year and then both count from 1, issuing
--  duplicate invoice numbers. The counter has to be one row per year for the
--  row lock to mean anything.
--
--  WHAT CHANGES
--  ------------
--    + UNIQUE KEY on invoice_sequence.financial_year
--    ~ seeds the current financial year from the highest number already used,
--      so numbering CONTINUES the existing book rather than restarting at 1
--      and colliding with bills that are already issued
--
--  THE SEED IS THE IMPORTANT PART
--  ------------------------------
--  The existing bills are numbered INV000001 .. INV000015 (the seed data),
--  plus the timestamp ones from testing. Starting a fresh counter at 1 would
--  re-issue INV000001 and produce a duplicate invoice number, which is worse
--  than the problem being fixed. So the seed takes the largest integer found
--  in any existing invoice_number and starts above it.
--
--  Timestamp numbers are deliberately EXCLUDED from that maximum: seeding
--  from 1786939073522 would push the counter into the trillions and make the
--  series absurd. They are test residue, not issued invoices. The filter is
--  on length — a real sequence number here is at most 8 digits.
--
--  SAFETY
--  ------
--  Additive. Re-runnable: the unique key is guarded, and the seed only
--  inserts when no row exists for the year, so running twice does not
--  advance the counter.
--
--  Verify:
--      SELECT * FROM invoice_sequence;
--
--  TO APPLY
--  --------
--    mysql -u root -p jl_jewellers_erp < database/migrations/2026-08-17_09_invoice_sequence_unique_year.sql
-- =====================================================================

SET @schema := DATABASE();

-- --- one row per financial year -------------------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE invoice_sequence ADD UNIQUE KEY uq_invoice_sequence_year (financial_year)',
        'SELECT ''uq_invoice_sequence_year already exists — skipped'' AS note'
    )
    FROM information_schema.statistics
    WHERE table_schema = @schema AND table_name = 'invoice_sequence'
      AND index_name = 'uq_invoice_sequence_year'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- --- current Indian financial year, April to March -------------------------
--  April 2026 - March 2027  ->  '2026-27'
SET @fy := IF(
    MONTH(CURDATE()) >= 4,
    CONCAT(YEAR(CURDATE()), '-', LPAD(MOD(YEAR(CURDATE()) + 1, 100), 2, '0')),
    CONCAT(YEAR(CURDATE()) - 1, '-', LPAD(MOD(YEAR(CURDATE()), 100), 2, '0'))
);

-- --- seed above the highest number already issued --------------------------
--  Digits only, ignoring anything longer than 8 (the Date.now() residue).
SET @highest := (
    SELECT COALESCE(MAX(CAST(digits AS UNSIGNED)), 0)
    FROM (
        SELECT REGEXP_REPLACE(invoice_number, '[^0-9]', '') AS digits
        FROM bills
        WHERE invoice_number IS NOT NULL
    ) AS extracted
    WHERE digits <> '' AND LENGTH(digits) <= 8
);

--  INSERT IGNORE, not INSERT ... WHERE NOT EXISTS: the unique key added above
--  is what makes the re-run safe, and a second run is silently skipped rather
--  than advancing the counter.
INSERT IGNORE INTO invoice_sequence (financial_year, last_invoice_number)
VALUES (@fy, @highest);

SELECT financial_year, last_invoice_number AS seeded_at FROM invoice_sequence;
