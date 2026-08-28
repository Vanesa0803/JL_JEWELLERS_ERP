/**
 * GST invoice numbering (S1-8).
 *
 * Bills used to be numbered `"INV-" + Date.now()`. That is unique, and unique
 * is the only thing it is. Rule 46(b) of the CGST Rules requires the number on
 * a tax invoice to be a CONSECUTIVE SERIAL NUMBER, unique within a financial
 * year. A millisecond timestamp is neither consecutive nor a series, so every
 * bill numbered that way is non-compliant on its face.
 *
 * This allocates from the `invoice_sequence` table, which already existed for
 * the purpose and had never been written to.
 *
 * WHY THIS TAKES A CONNECTION RATHER THAN USING THE POOL
 * -----------------------------------------------------
 * The number MUST be allocated on the same connection, inside the same
 * transaction, as the INSERT into bills. That is what makes the series
 * gapless:
 *
 *   - the UPDATE below takes an exclusive row lock that is held until COMMIT,
 *     so a second bill starting concurrently blocks there rather than reading
 *     the same number
 *   - if the bill fails and the transaction rolls back, the increment rolls
 *     back with it, so a failed bill does not burn a number
 *
 * Allocating from the pool instead would break both properties, and would do
 * so invisibly — the bug only shows up under concurrency or after a failure,
 * neither of which appears in normal testing.
 *
 * COST: bill creation is serialised on this one row. For a single-till shop
 * that is irrelevant, and it is the correct trade regardless: a legally
 * gapless series is worth more than parallel billing to a business that has
 * one person at the counter.
 *
 * FORMAT: INV/2026-27/0016
 * Fits the varchar(30) column with room to spare. Set INVOICE_PREFIX in
 * backend/.env to change the prefix.
 */

const PREFIX = process.env.INVOICE_PREFIX || "INV";

/**
 * The Indian financial year runs 1 April to 31 March.
 * April 2026 - March 2027 is "2026-27".
 */
export const financialYear = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() is 0-based
  const startYear = month >= 4 ? year : year - 1;
  const endYear = String((startYear + 1) % 100).padStart(2, "0");

  return `${startYear}-${endYear}`;
};

/**
 * Allocate the next invoice number.
 *
 * Callback style, because bill.model.js runs on the callback pool and the
 * transaction has to stay pinned to the connection passed in.
 *
 *   allocateInvoiceNumber(connection, (error, invoiceNumber) => { ... })
 */
export const allocateInvoiceNumber = (connection, callback) => {
  const fy = financialYear();

  // First bill of a new financial year: create the counter. INSERT IGNORE
  // relies on the unique key added in migration 2026-08-17_09 — without it
  // two concurrent bills would each create a row and then both count from 1.
  connection.query(
    "INSERT IGNORE INTO invoice_sequence (financial_year, last_invoice_number) VALUES (?, 0)",
    [fy],
    (insertError) => {
      if (insertError) {
        return callback(insertError);
      }

      // Takes the row lock. Held until this transaction commits or rolls back.
      connection.query(
        "UPDATE invoice_sequence SET last_invoice_number = last_invoice_number + 1 WHERE financial_year = ?",
        [fy],
        (updateError, updateResult) => {
          if (updateError) {
            console.error("INVOICE UPDATE ERROR:", updateError);
            return callback(updateError);
          }

          console.log("INVOICE UPDATE RESULT:", {
            affectedRows: updateResult.affectedRows,
            changedRows: updateResult.changedRows,
            message: updateResult.message,
            fy
          });

          if (updateResult.affectedRows < 1) {
            return callback(
              new Error(`Could not allocate an invoice number for ${fy}`)
            );
          }

          // Reads this transaction's own uncommitted increment.
          connection.query(
            "SELECT last_invoice_number FROM invoice_sequence WHERE financial_year = ?",
            [fy],
            (selectError, rows) => {
              if (selectError) {
                return callback(selectError);
              }

              if (!rows.length) {
                return callback(
                  new Error(`Invoice counter for ${fy} disappeared mid-transaction`)
                );
              }

              const serial = rows[0].last_invoice_number;
              const invoiceNumber = `${PREFIX}/${fy}/${String(serial).padStart(4, "0")}`;

              return callback(null, invoiceNumber);
            }
          );
        }
      );
    }
  );
};

export default allocateInvoiceNumber;
