-- =====================================================================
--  Migration 2026-08-13_08
--  Link employees to departments properly
-- =====================================================================
--
--  WHY
--  ---
--  The employee code joins on a column that does not exist (S2-2):
--
--      LEFT JOIN departments d ON e.department_id = d.department_id
--      INSERT INTO employees (..., department_id) VALUES (...)
--
--  `employees` stores the department as free text instead:
--
--      employee_id  name          department   designation
--      1            Rohan Sharma  Sales        Sales Executive
--      2            Priya Singh   Accounts     Accountant
--
--  A `departments` table already exists and the values line up exactly:
--
--      department_id  department_name
--      1              Sales
--      2              Accounts
--
--  So the normalised design was intended and simply never finished — the same
--  pattern as cash_ledger, income/expenses and supplier_documents. The code
--  was written against the design; the schema stopped halfway.
--
--  WHAT CHANGES
--  ------------
--    + employees.department_id, with a foreign key to departments
--    ~ backfilled by matching the existing text against department_name
--
--  The old `department` text column is KEPT, not dropped:
--    - dropping a populated column during a merge is not worth the risk
--    - existing queries do SELECT *, so removing it could break a caller
--      that has not been exercised yet
--  It is now redundant, and department_id is authoritative. Removing it is a
--  tidy-up for later, once nothing reads it.
--
--  SAFETY
--  ------
--  Additive and nullable, with the backfill matched on exact name. Any row
--  whose text does not match a department is simply left NULL rather than
--  guessed at. Re-runnable.
--
--  Verify the backfill covered everything:
--      SELECT employee_id, name, department, department_id
--        FROM employees WHERE department_id IS NULL AND department IS NOT NULL;
--
--  TO APPLY
--  --------
--    mysql -u root -p jl_jewellers_erp < database/migrations/2026-08-13_08_employees_department_id.sql
-- =====================================================================

SET @schema := DATABASE();

-- --- employees.department_id ----------------------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE employees ADD COLUMN department_id INT NULL DEFAULT NULL AFTER department',
        'SELECT ''employees.department_id already exists — skipped'' AS note'
    )
    FROM information_schema.columns
    WHERE table_schema = @schema AND table_name = 'employees' AND column_name = 'department_id'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- --- backfill from the existing text --------------------------------------
UPDATE employees e
  JOIN departments d ON e.department = d.department_name
   SET e.department_id = d.department_id
 WHERE e.department_id IS NULL;

-- --- foreign key -----------------------------------------------------------
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE employees
            ADD CONSTRAINT fk_employees_department
            FOREIGN KEY (department_id) REFERENCES departments(department_id)',
        'SELECT ''fk_employees_department already exists — skipped'' AS note'
    )
    FROM information_schema.table_constraints
    WHERE table_schema = @schema AND table_name = 'employees'
      AND constraint_name = 'fk_employees_department'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
