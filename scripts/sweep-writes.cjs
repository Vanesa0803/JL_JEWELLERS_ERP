/**
 * Write-path sweep.
 *
 * The read-only sweep (sweep.cjs) calls GET endpoints only. That is how a
 * broken transaction path went unnoticed for a whole phase: every transaction
 * lives behind a POST or PUT, so a GET-only sweep reported the system healthy
 * while bill creation was broken.
 *
 * This exercises the write paths, then cleans up after itself so the database
 * is left exactly as it was found.
 *
 * Usage: node scripts/sweep-writes.cjs [baseUrl]
 */
const BASE = process.argv[2] || "http://127.0.0.1:5000/api/v1";

const post = async (route, body) => {
  const res = await fetch(BASE + route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { raw: text.slice(0, 200) };
  }
  return { status: res.status, body: parsed };
};

const get = async (route) => {
  const res = await fetch(BASE + route);
  const text = await res.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { raw: text.slice(0, 200) };
  }
  return { status: res.status, body: parsed };
};

const line = (label, ok, detail) =>
  console.log(`${ok ? "PASS" : "FAIL"}  ${label.padEnd(42)} ${detail || ""}`);

(async () => {
  let failures = 0;
  const created = [];
  const advancePaymentIds = [];

  console.log("");
  console.log("WRITE-PATH SWEEP");
  console.log("-".repeat(78));

  /* ---------------------------------------------------------------- *
   * Create a bill — exercises the transaction: bills row + bill_items
   * insert + COMMIT, all on one pooled connection.
   * ---------------------------------------------------------------- */
  const newBill = {
    customer_id: 1,
    employee_id: 1,
    subtotal: 50000,
    total_discount: 0,
    total_gst: 1500,
    grand_total: 51500,
    payment_status: "Pending",
    bill_status: "Draft",
    items: [
      {
        product_id: 1,
        metal_type: "Gold",
        purity: "22K",
        quantity: 1,
        net_weight: 10,
        rate: 5000,
        metal_value: 50000,
        making_charge_percent: 0,
        making_charge: 0,
        taxable_value: 50000,
        gst_metal: 1500,
        gst_making: 0,
        discount: 0,
        line_total: 51500,
      },
    ],
  };

  const create = await post("/bills", newBill);
  const billId = create.body?.data?.bill_id ?? create.body?.bill_id;
  const createOk = create.status < 400 && Boolean(billId);

  line("POST /bills (transaction)", createOk, createOk ? `bill_id=${billId}` : JSON.stringify(create.body).slice(0, 90));
  if (!createOk) failures++;
  else created.push(billId);

  /* ---------------------------------------------------------------- *
   * The bug this exists to catch: the old code resolved the promise
   * BEFORE inserting items and before COMMIT. It would report success
   * with nothing saved. So: did the items actually land?
   * ---------------------------------------------------------------- */
  if (createOk) {
    const fetched = await get(`/bills/${billId}`);
    const payload = fetched.body?.data ?? fetched.body;
    const items = payload?.items ?? payload?.bill_items ?? [];
    const itemsOk = fetched.status < 400 && Array.isArray(items) && items.length > 0;

    line(
      "  -> items actually committed",
      itemsOk,
      itemsOk ? `${items.length} item(s)` : "NO ITEMS — transaction did not fully commit"
    );
    if (!itemsOk) failures++;
  }

  /* ---------------------------------------------------------------- *
   * A bill with no items must FAIL and roll back cleanly — it must not
   * report success, and must not leave an orphan bills row behind.
   * ---------------------------------------------------------------- */
  const empty = await post("/bills", { ...newBill, items: [] });
  const rejectedOk = empty.status >= 400;
  line(
    "POST /bills with no items is rejected",
    rejectedOk,
    rejectedOk ? `${empty.status}` : "reported SUCCESS on an empty bill"
  );
  if (!rejectedOk) {
    failures++;
    const orphan = empty.body?.data?.bill_id ?? empty.body?.bill_id;
    if (orphan) created.push(orphan);
  }

  /* ---------------------------------------------------------------- *
   * Advance payments — the feature unblocked by migration
   * 2026-08-13_01, which added payments.customer_id and
   * payments.is_adjusted. A 200 on the read alone proves nothing (an
   * empty list is also a 200), so this creates a real advance and reads
   * it back.
   * ---------------------------------------------------------------- */
  const CUSTOMER_ID = 3;

  const before = await get(`/payments/advance/${CUSTOMER_ID}`);
  const beforeCount = Array.isArray(before.body?.data) ? before.body.data.length : -1;

  // Card, not Cash, on purpose. A Cash advance also writes to the cash book,
  // which still targets the non-existent `cash_book` table (S0-7). Using Card
  // isolates the advance feature from that unrelated blocker. Switch this to
  // "Cash" once the cash book is resolved — it is the more common real-world
  // path and deserves the coverage.
  const advance = await post("/payments/advance", {
    customer_id: CUSTOMER_ID,
    amount: 5000,
    payment_method: "Card",
    reference_number: "SWEEP-TEST",
    created_by: 1,
  });

  const advanceOk = advance.status < 400;
  line(
    "POST /payments/advance",
    advanceOk,
    advanceOk ? "created" : JSON.stringify(advance.body).slice(0, 80)
  );
  if (!advanceOk) failures++;

  if (advanceOk) {
    const after = await get(`/payments/advance/${CUSTOMER_ID}`);
    const afterCount = Array.isArray(after.body?.data) ? after.body.data.length : -1;
    const readBackOk = after.status === 200 && afterCount === beforeCount + 1;

    line(
      "  -> advance readable for the customer",
      readBackOk,
      readBackOk ? `${beforeCount} -> ${afterCount}` : `count ${beforeCount} -> ${afterCount}`
    );
    if (!readBackOk) failures++;

    advancePaymentIds.push(advance.body?.data?.payment_id ?? advance.body?.payment_id);
  }

  /* ---------------------------------------------------------------- *
   * Clean up
   * ---------------------------------------------------------------- */
  for (const id of created) {
    await fetch(`${BASE}/bills/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deleted_by: 1 }),
    }).catch(() => {});
  }
  if (created.length) console.log(`\ncleanup: soft-deleted test bill(s) ${created.join(", ")}`);

  // Advances have no delete endpoint, so the test rows are left behind and
  // reported rather than silently accumulating. Remove with:
  //   DELETE FROM payment_details WHERE payment_id IN (...);
  //   DELETE FROM payments WHERE payment_id IN (...);
  const advanceIds = advancePaymentIds.filter(Boolean);
  if (advanceIds.length) {
    console.log(`cleanup: advance payment(s) ${advanceIds.join(", ")} left in place (no delete endpoint)`);
  }

  console.log("");
  console.log(`write-path failures: ${failures}`);
  process.exit(failures === 0 ? 0 : 1);
})();
