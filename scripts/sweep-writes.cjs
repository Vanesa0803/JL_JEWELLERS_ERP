/**
 * Write-path sweep.
 *
 * The read-only sweep (sweep.cjs) calls GET endpoints only. That is how a
 * broken transaction path went unnoticed for a whole phase: every transaction
 * lives behind a POST or PUT, so a GET-only sweep reported the system healthy
 * while bill creation was broken.
 *
 * This exercises the write paths, then cleans up as far as the API allows.
 *
 * CLEANUP IS INCOMPLETE, ON PURPOSE
 * ---------------------------------
 * The sweep can only use endpoints that exist. `DELETE /bills/:id` is a SOFT
 * delete, and creating a bill also writes bill_items and a customer_ledger row,
 * neither of which has a delete endpoint. So every run leaves residue behind.
 *
 * That is correct behaviour for an accounting system — you do not hard-delete
 * financial records — but it means test rows accumulate. Purge them with:
 *
 *   DELETE FROM bill_items     WHERE bill_id IN (SELECT bill_id FROM bills WHERE deleted_at IS NOT NULL);
 *   DELETE FROM customer_ledger WHERE bill_id IN (SELECT bill_id FROM bills WHERE deleted_at IS NOT NULL);
 *   DELETE FROM bills          WHERE deleted_at IS NOT NULL;
 *   DELETE FROM payment_details WHERE payment_id IN (SELECT payment_id FROM payments WHERE payment_type='Advance');
 *   DELETE FROM payments       WHERE payment_type='Advance';
 *
 * Run this against a development database only.
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

const patch = async (route, body) => {
  const res = await fetch(BASE + route, {
    method: "PATCH",
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

  // Cash on purpose — it is the longest path. A Cash advance writes the
  // payment, its detail, AND a cash_ledger entry, so it exercises the
  // cross-module hop into finance that used to fail (S0-7 / S2-18).
  const advance = await post("/payments/advance", {
    customer_id: CUSTOMER_ID,
    amount: 5000,
    payment_method: "Cash",
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
   * Customer orders — three transaction sites (create / cancel /
   * deliver) were rewritten onto pooled connections via
   * utils/withTransaction.js. Reads cannot detect a broken transaction,
   * so the full create -> cancel round trip runs here.
   * ---------------------------------------------------------------- */
  const order = await post("/customer-orders", {
    customer_id: CUSTOMER_ID,
    expected_delivery: "2026-12-31",
    // enum('Ready Stock','Custom Jewellery','Repair') — must match exactly
    order_type: "Custom Jewellery",
    total_amount: 20000,
    advance_amount: 5000,
    remarks: "SWEEP-TEST",
    items: [
      {
        product_id: 1,
        quantity: 1,
        gross_weight: 12,
        net_weight: 11,
        purity_id: 1,
        making_charge: 1000,
        estimated_price: 20000,
        remarks: "SWEEP-TEST",
      },
    ],
  });

  const orderId = order.body?.data?.customer_order_id ?? order.body?.customer_order_id;
  const orderOk = order.status < 400 && Boolean(orderId);

  line(
    "POST /customer-orders (transaction)",
    orderOk,
    orderOk ? `order ${orderId}` : JSON.stringify(order.body).slice(0, 80)
  );
  if (!orderOk) failures++;

  if (orderOk) {
    // Did the items actually commit, or did only the order row land?
    const readBack = await get(`/customer-orders/${orderId}`);
    const payload = readBack.body?.data ?? readBack.body;
    const items = payload?.items ?? [];
    const itemsOk = readBack.status === 200 && Array.isArray(items) && items.length > 0;

    line(
      "  -> order items committed",
      itemsOk,
      itemsOk ? `${items.length} item(s)` : "NO ITEMS — transaction incomplete"
    );
    if (!itemsOk) failures++;

    // cancelOrder is a second transaction site, with its own rollback path
    const cancel = await patch(`/customer-orders/${orderId}/cancel`, {
      remarks: "SWEEP-TEST cleanup",
    });
    const cancelOk = cancel.status < 400;
    line("PATCH /customer-orders/:id/cancel", cancelOk, cancelOk ? "cancelled" : `${cancel.status}`);
    if (!cancelOk) failures++;
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
