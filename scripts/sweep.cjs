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
  "GET /dashboard": "FAIL cash_book",
  "GET /cashbook/statement": "FAIL cash_book",
  "GET /finance/balance-sheet": "FAIL cash_book",
  "GET /finance/cash-flow": "FAIL cash_book",
  "GET /financial-security/": "FAIL financial_security",
  "GET /payments/history": "FAIL p.customer_id",
  "GET /income/history": "FAIL income_date",
  "GET /reports/gst": 200,
  "GET /reports/customers": 200,
  "GET /reports/payments": 200,
  "GET /ledger/1": 200,
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
