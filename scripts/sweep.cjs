/**
 * Endpoint sweep. Calls every known endpoint and prints the result next to the
 * recorded baseline, so a regression is obvious.
 *
 * Usage: node sweep.cjs [baseUrl]
 */
const BASE = process.argv[2] || "http://127.0.0.1:5000/api/v1";

const BASELINE = {
  "GET /bills": 200,
  "GET /reports/sales": 200,
  "GET /analytics/monthly-revenue": 200,
  "GET /customer-orders": 200,
  "GET /makers": 200,
  "GET /gold-schemes/types": 200,
  "GET /employees": 200,
  // Unblocked by migrations 2026-08-13_02 (cash_ledger) and _03 (income /
  // expenses). All were failing before the finance module was merged.
  "GET /dashboard": 200,
  "GET /cashbook/statement": 200,
  "GET /finance/balance-sheet": 200,
  "GET /finance/cash-flow": 200,
  "GET /finance/profit-loss": 200,
  "GET /finance/summary/cash-flow": 200,
  "GET /finance/summary/profit-loss": 200,
  "GET /income/history": 200,

  // Reports, analytics, dashboard and exports — module 5.
  "GET /reports/inventory": 200,
  "GET /reports/ledger": 200,
  "GET /analytics/sales-target": 200,
  "GET /analytics/yearly-revenue": 200,
  "GET /analytics/customer-analytics": 200,
  "GET /analytics/financial-analytics": 200,
  "GET /dashboard/inventory": 200,
  "GET /dashboard/stock-movement": 200,

  // Exports genuinely produce files. Note the parameter is `report`, not `type`.
  "GET /export/csv?report=sales": 200,
  "GET /export/pdf?report=sales": 200,
  "GET /export/excel?report=sales": 200,

  // Unblocked by module 8. The code queried a `financial_security` table that
  // never existed; the real one is `financial_pin`, and the security settings
  // moved to `financial_settings`, which already had max_discount_percent.
  "GET /financial-security/": 200,

  // Phase B — customers and suppliers.
  "GET /customers": 200,
  "GET /customers/3": 200,
  "GET /customers/3/documents": 200,
  "GET /customers/3/notes": 200,
  "GET /customers/3/loyalty/history": 200,
  "GET /customers/vip/list": 200,
  "GET /customers/3/purchase-history": 200,
  "GET /customers/3/ltv": 200,
  "GET /customers/tracking/birthdays": 200,
  "GET /customers/tracking/anniversaries": 200,
  "GET /suppliers": 200,
  "GET /suppliers/1": 200,
  "GET /suppliers/1/documents": 200,
  "GET /products": 200,
  "GET /products/1": 200,
  "GET /products/1/variants": 200,
  "GET /products/1/barcodes": 200,
  "GET /products/1/images": 200,
  "GET /inventory": 200,
  "GET /inventory/low-stock": 200,
  "GET /inventory/movements": 200,
  "GET /inventory-analytics/gold": 200,
  "GET /inventory-analytics/silver": 200,
  "GET /inventory-analytics/dead-stock": 200,
  "GET /inventory-analytics/fast-moving": 200,
  "GET /inventory-analytics/slow-moving": 200,
  "GET /inventory-analytics/overstock": 200,
  "GET /inventory-analytics/stock-aging": 200,

  // Phase B — masters, recovered from developer-purvansh. This code had never
  // run before 2026-08-13.
  "GET /categories": 200,
  "GET /categories/1": 200,
  "GET /categories/1/subcategories": 200,
  "GET /subcategories/1": 200,
  "GET /designs": 200,
  "GET /designs/1": 200,
  "GET /purity": 200,
  "GET /purity/1": 200,
  "GET /metal-types": 200,
  "GET /metal-types/1": 200,
  "GET /stone-types": 200,
  "GET /stone-types/1": 200,

  // Fixed when the payments module was merged — S2-15. Now expected to pass,
  // so a future change that reintroduces the bug shows up as a regression.
  "GET /payments/history": 200,
  "GET /payments/refund-history": 200,
  "GET /payments/receipt/1": 200,

  // Unblocked by migration 2026-08-13_01, which added payments.customer_id
  // and payments.is_adjusted.
  "GET /payments/advance/1": 200,
  "GET /reports/gst": 200,
  "GET /reports/customers": 200,
  "GET /reports/payments": 200,
  // Ledger — all six types come from Riya's implementation, which uses the real
  // customer_ledger / supplier_ledger tables (module 3).
  "GET /ledger/1": 200,
  "GET /ledger/3": 200,
  "GET /ledger/3/statement": 200,
  "GET /ledger/3/outstanding": 200,
  "GET /ledger/supplier/1": 200,
  "GET /ledger/supplier/1/outstanding": 200,
  "GET /maker-assignments": 200,
  "GET /analytics/profit-trends": 200,
  "GET /expenses/history": 200,
  "GET /finance/gst-summary": 200,
  "GET /finance/outstanding-payables": 200,
  "GET /dashboard/sales-analytics": 200,
};

const short = (s) => String(s).replace(/\s+/g, " ").slice(0, 58);

(async () => {
  const rows = [];
  let regressions = 0;

  for (const key of Object.keys(BASELINE)) {
    const [method, route] = key.split(" ");
    let actual;
    let detail = "";

    try {
      const res = await fetch(BASE + route, { method });
      const body = await res.text();

      if (res.ok) {
        actual = 200;
      } else {
        actual = res.status;
        try {
          detail = JSON.parse(body).message || "";
        } catch {
          detail = body.slice(0, 60);
        }
      }
    } catch (error) {
      actual = "ERR";
      detail = error.message;
    }

    const expected = BASELINE[key];
    const expectedFail = typeof expected === "string";
    const actualFail = actual !== 200;

    // Matches baseline if both succeeded, or both failed.
    const same = expectedFail === actualFail;
    if (!same) regressions++;

    rows.push({
      route: key,
      expected: expectedFail ? "fail" : "200",
      actual: actualFail ? String(actual) : "200",
      verdict: same ? (actualFail ? "same (still broken)" : "OK") : "*** CHANGED ***",
      detail: short(detail),
    });
  }

  const w = Math.max(...rows.map((r) => r.route.length));
  console.log("");
  console.log("ROUTE".padEnd(w), "BASE".padEnd(5), "NOW".padEnd(5), "VERDICT");
  console.log("-".repeat(w + 40));
  for (const r of rows) {
    console.log(
      r.route.padEnd(w),
      r.expected.padEnd(5),
      r.actual.padEnd(5),
      r.verdict,
      r.detail ? "| " + r.detail : ""
    );
  }
  console.log("");
  console.log(`regressions vs baseline: ${regressions}`);
  process.exit(regressions === 0 ? 0 : 1);
})();
