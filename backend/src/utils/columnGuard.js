/**
 * Column whitelisting for the dynamic INSERT/UPDATE builders (S1-7).
 *
 * Seventeen repositories build SQL like this:
 *
 *     const fields = Object.keys(data);
 *     `INSERT INTO customers (${fields.join(', ')}) VALUES (${placeholders})`
 *     `UPDATE customers SET ${fields.map(f => `${f} = ?`).join(', ')}`
 *
 * The VALUES are parameterised, so the values were never the problem. The
 * COLUMN NAMES are string-interpolated straight from `req.body`, and a
 * placeholder cannot stand in for an identifier — so whatever the client puts
 * in the key position is pasted into the statement verbatim.
 *
 * That is two separate problems:
 *
 *   1. SQL injection. A request body keyed
 *      `{"name = 'x', deleted_at = NOW() WHERE 1=1 -- ": 1}` writes its way
 *      out of the SET clause. Nothing sanitises it today.
 *
 *   2. Mass assignment. Even with well-formed keys, the client picks which
 *      columns get written. Anything the API never meant to expose is
 *      writable as long as it is a real column.
 *
 * WHY THE SCHEMA RATHER THAN HAND-WRITTEN LISTS
 * ---------------------------------------------
 * The obvious fix is a literal array of allowed columns in each of the 17
 * files. That is 17 lists to write and then 17 lists to keep in step with the
 * schema — and a list that has drifted from the table fails by REJECTING a
 * valid write, which looks like an unrelated bug and gets "fixed" by someone
 * widening the list until it stops complaining.
 *
 * Reading the real columns from information_schema cannot drift, cannot be
 * forgotten when a migration adds a column, and is strictly accurate: an
 * identifier is allowed only if a column by exactly that name exists on
 * exactly that table. Injection is then impossible by construction, because
 * no real column is ever named `name = 'x' -- `.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * It stops problem 1 completely and narrows problem 2 to "any real column of
 * this table". It does not express "customers may set phone but never
 * loyalty_points" — that needs a per-endpoint field list, which is a design
 * decision per resource rather than a patch. Tracked separately; this is the
 * part that can be fixed without inventing policy.
 *
 * The cache is populated once per table on first use and lives for the life of
 * the process. A migration that adds a column therefore needs a restart before
 * that column is writable — acceptable, since applying a migration to a
 * running server is not a thing anyone does here.
 */

import { pool } from "../config/db.js";
import { ApiError } from "./ApiError.js";

const cache = new Map();

/**
 * The real column names of a table, lowercased, as a Set.
 */
const columnsOf = async (table) => {
  if (cache.has(table)) {
    return cache.get(table);
  }

  // `table` is always a literal written in our own code, never user input.
  // Passed as a parameter anyway rather than interpolated.
  const [rows] = await pool.query(
    `SELECT column_name AS name
       FROM information_schema.columns
      WHERE table_schema = DATABASE() AND table_name = ?`,
    [table]
  );

  if (rows.length === 0) {
    // A typo'd table name here would otherwise reject every column and read
    // as "all my fields are invalid", which sends you looking in the wrong place.
    throw new ApiError(500, `Unknown table "${table}" while validating columns`);
  }

  const names = new Set(rows.map((row) => String(row.name).toLowerCase()));
  cache.set(table, names);

  return names;
};

/**
 * Assert that every field name is a real column of the table.
 *
 * Call this immediately before interpolating the names into SQL:
 *
 *     const fields = definedEntries.map(([key]) => key);
 *     await assertColumns('customers', fields);
 *
 * Throws 400 on an unknown column rather than silently dropping it: a write
 * that quietly ignores half its payload is worse than one that fails, because
 * the caller is told it succeeded.
 */
export const assertColumns = async (table, fields) => {
  const allowed = await columnsOf(table);

  const rejected = fields.filter(
    (field) => !allowed.has(String(field).toLowerCase())
  );

  if (rejected.length > 0) {
    throw new ApiError(
      400,
      `Unknown field${rejected.length > 1 ? "s" : ""} for ${table}: ${rejected.join(", ")}`
    );
  }

  return fields;
};

export default assertColumns;
