# JL Jewellers ERP — Severity-Rated Remediation Backlog

Companion to [FEATURE_STATUS_AUDIT.md](FEATURE_STATUS_AUDIT.md) · Audit date: 2026-08-13

Everything outstanding, rated by severity, with effort, dependencies and owner area.
Item IDs are stable — use them in commits and PR titles.

---

## Rating method

**Severity** answers *"what happens if we ship without fixing this?"* — not *"how hard is it?"*
Effort is tracked separately, because the cheapest fixes here are also the most severe.

| Level | Name | Definition |
|:--:|---|---|
| **S0** | **Blocker** | The system cannot run or cannot be demonstrated at all. Nothing downstream can be built or tested. |
| **S1** | **Critical** | Runs, but causes credential compromise, unauthorised data access, or corrupt financial records. Unacceptable in a jewellery business handling cash, gold and customer KYC. |
| **S2** | **High** | A completed feature silently produces wrong output, or a claimed feature does not execute. Erodes trust in the numbers. |
| **S3** | **Medium** | Architectural or process debt. Nothing breaks today; everything gets slower and riskier from here. |
| **S4** | **Low** | Genuinely unbuilt features, cosmetics, and nice-to-haves. Real work, but the business survives without it. |

**Effort:** `XS` <2h · `S` ½–1 day · `M` 2–3 days · `L` 1–2 weeks · `XL` >2 weeks
**Area:** `INFRA` · `SEC` · `BE-FIN` · `BE-INV` · `BE-HR` · `FE` · `DB` · `PROC` (process)

---

## Severity distribution

| Level | Items | Total effort | Share of effort |
|:--:|:--:|:--:|:--:|
| S0 — Blocker | 8 | ~4 days | 3% |
| S1 — Critical | 9 | ~9 days | 6% |
| S2 — High | 14 | ~16 days | 11% |
| S3 — Medium | 13 | ~30 days | 21% |
| S4 — Low | 17 | ~85 days | 59% |
| **Total** | **61** | **~144 dev-days** | |

> **The shape of this table is the headline.** 9% of the remaining effort (S0+S1, ~13 days)
> stands between this project and a system that runs safely. The team has been reporting
> against the 59% tail while the 9% head is unaddressed.

---

# S0 — Blockers

*Nothing can be integrated, tested, or demonstrated until every item here is closed.
Combined effort: ~4 days. This is the single highest-leverage work in the project.*

| ID | Item | Area | Effort | Evidence | Blocks |
|:--:|---|:--:|:--:|---|---|
| **S0-1** | Collapse the two Express apps into one on one port | INFRA | M | `backend/app.js` (auth, 5005) vs `backend/src/app.js` (finance, 5000, **no `/api/auth`**) | Everything |
| **S0-2** | Point the frontend at the port the backend actually serves | FE | XS | `api/axios.js` + `services/api.js` → `:5005`; `src/server.js` → `PORT \|\| 5000` | Every API call |
| **S0-3** | Install `bcryptjs` (required, not in `package.json`) | INFRA | XS | `authController.js:2` vs `backend/package.json` (has `bcrypt`) | Auth server startup |
| **S0-4** | Fix the JWT signing secret | SEC | XS | `authController.js:29` signs with literal `"secret"`; middleware verifies `process.env.JWT_SECRET` | All authenticated routes |
| **S0-5** | Fix the JWT payload key (`user.id` → `user.user_id`) | BE-HR | XS | `users` PK is `user_id`; token payload is `{id: undefined}` | Any user-scoped logic |
| **S0-6** | Fix the unresolvable import in `CreateBill.jsx` | FE | XS | Line 12: `"../api/axios"` → resolves to `src/pages/api/axios` | Vite build |
| **S0-7** | ~~Rename table `cash_book` → `cash_ledger`~~ **NOT A RENAME — needs a decision** | BE-FIN | **M** | **Verified 2026-08-13 against the live database.** `cash_ledger` has `cash_entry_id, transaction_date, transaction_type, amount, description, created_at`. The code writes `transaction_type, source, reference_id, customer_id, amount, remarks, created_by`. **Only `transaction_type` and `amount` overlap** — 5 columns are missing and `description`/`remarks` differ in name | Dashboard summary, Cash Book, Cash Flow, Balance Sheet, and Cash advances. A find-and-replace here would fail immediately. Three options: extend `cash_ledger` to the richer shape the code expects (recommended, mirrors migration 2026-08-13_01), create `cash_book` as its own table, or simplify the code and lose `source`/`reference_id`/`customer_id`/`created_by` |
| **S0-8** | Rename table `financial_security` → `financial_pin` (4 queries) | BE-FIN | XS | `financialSecurityModel.js` | Entire PIN module + bill cancel/edit |

**Definition of done for S0:** `npm run dev` in both folders, log in through the UI,
and `GET /api/dashboard` returns 200 with real numbers.

---

# S1 — Critical

*Security and financial-integrity defects. Every one of these is exploitable or
corrupting today. Combined effort: ~9 days.*

| ID | Item | Area | Effort | Evidence | Why critical |
|:--:|---|:--:|:--:|---|---|
| **S1-1** | Rotate the two committed DB passwords and the JWT secret | SEC | XS | `.env` on `main` (`DB_PASSWORD=aditya042006`, `JWT_SECRET=mySuperSecretKey123`); `backend/.env` on `developer-purvansh` (`DB_PASSWORD=gupta@2007`) | Live credentials are in a GitHub repo. **Do this first — before any code work.** |
| **S1-2** | Purge `.env` from git history across all branches | SEC | S | Present in 4 commits: `5114f41`, `1729696`, `6b863e9`, `d3f71cd` | Rotation alone doesn't help if history is public |
| **S1-3** | Write `auth.js` and mount it on every business route | SEC | M | `backend/src/middleware/auth.js` is **0 bytes**; no route file imports it | Bills, payments, ledgers and customer KYC are **fully unauthenticated** |
| **S1-4** | Mount `ProtectedRoute` in the router | FE | XS | `AppRouter.jsx` never imports its own `ProtectedRoute.jsx` | Every screen reachable without login |
| **S1-5** | Write a real `.gitignore` on `main`; untrack `node_modules` | INFRA | XS | `.gitignore` on `main` is **0 bytes**; `node_modules/` is committed | Repo hygiene + how the `.env` leak happened |
| **S1-6** | Restrict CORS to known origins on the finance backend | SEC | XS | `backend/src/app.js:27` — bare `app.use(cors())` | Any site can call the API once auth exists |
| **S1-7** | Whitelist column names in the dynamic INSERT/UPDATE builders | SEC | M | `Object.keys(req.body)` interpolated as column names in ~12 `*.repository.js` files (INV) | Mass assignment — a client can write any column, including `customer_code`, balances, status |
| **S1-8** | Replace `"INV-" + Date.now()` with the `invoice_sequence` table | BE-FIN | S | `billModel.js` createBill; `invoice_sequence` + `invoice_settings` tables unused | **GST law requires sequential, gapless invoice numbers.** A timestamp is not compliant and is unauditable |
| **S1-9** | Drive GST from the `gst_rates` table, not hardcoded 3%/5% | BE-FIN | M | `utils/gstCalculator.js` is **0 bytes**; rates inline in `billingCalculator.js` | A rate change requires a code deploy; no historical rate accuracy on reprint |

---

# S2 — High

*Features marked complete that produce wrong output or cannot execute.
Combined effort: ~16 days.*

| ID | Item | Area | Effort | Evidence | Impact |
|:--:|---|:--:|:--:|---|---|
| **S2-1** | Fix attendance table name (`attendance` → `employee_attendance`) | BE-HR | XS | All 3 handlers in `attendanceController.js` | **Reported ✅ Completed; has never executed** |
| **S2-2** | Fix `employees.department_id` (schema has `department` varchar) | BE-HR | S | `employeeController.js` insert + LEFT JOIN | Employee create and list both 500 |
| **S2-3** | Multiply `quantity` into the bill line total | BE-FIN | XS | `billingCalculator.js` returns `quantity` but never multiplies by it | **Every multi-quantity bill undercharges.** Direct revenue loss |
| **S2-4** | Implement `invoiceGenerator.js` (0 bytes) | BE-FIN | M | `GET /bills/:id/print` currently returns JSON | "Print Invoice ✅" produces no printable invoice |
| **S2-5** | Implement `errorHandler.js` (0 bytes) and mount it | BE-FIN | S | Never mounted on `src/app.js`; INV branch has a working one to copy | Raw stack traces and DB errors leak to clients |
| **S2-6** | Implement `validate.js` (0 bytes) + add a validation library | BE-FIN | M | No validation anywhere in the project | Malformed payloads reach SQL directly |
| **S2-7** | Replace the 4 salary stub handlers with real logic | BE-HR | M | `salaryController.js` returns hardcoded `{success:true}` behind live authenticated routes | Endpoints report success while doing nothing |
| **S2-8** | Add a standalone outstanding-receivables endpoint | BE-FIN | S | Only exists as a field inside `/finance/balance-sheet`; reported ✅ | Claimed feature has no endpoint |
| **S2-9** | Upgrade `pdfExport.js` from key-value dump to a real report | BE-FIN | M | Dumps raw `key : value` lines | Unusable as a business document |
| **S2-10** | Complete `exceleExport.js` (734 bytes, minimal) — and fix the filename typo | BE-FIN | S | `exceleExport.js` | Reported ✅ |
| **S2-11** | De-duplicate the export surface | BE-FIN | S | `/api/reports/export/*` and `/api/export/*` both exist and overlap | Two code paths drift apart |
| **S2-12** | Wire `bank_ledger` and `expense_ledger` (tables unused) | BE-FIN | M | Only `bank_accounts` and `expenses` are covered | 2 of 6 ledgers reported ✅ are not backed |
| **S2-13** | Add a dedicated daily-ledger endpoint | BE-FIN | S | Currently approximated by the cash book statement | Reported ✅ |
| **S2-14** | Add rate limiting specifically to the login route | SEC | XS | `rateLimiter.js` is global only | Brute-force on the only auth endpoint |
| **S2-15** | Payments queries `p.customer_id`, which does not exist | BE-FIN | S | **Measured 2026-08-13:** `GET /api/payments/history` → `Unknown column 'p.customer_id'`. Real columns: `payment_id, bill_id, payment_date, total_amount, payment_status, payment_type, created_by, updated_by, created_at, updated_at` | Payment history and receipts fail. Must join via `bills` to reach the customer |
| **S2-16** | Income sorts by `income_date`, which does not exist | BE-FIN | XS | **Measured:** `GET /api/income/history` → `Unknown column 'income_date' in 'order clause'`. Real date column is `received_date` | Income history fails |
| **S2-17** | `createEmployee` inserts a `role` column that does not exist | BE-HR | XS | `employees` has `designation`, not `role`. Reading works; creating fails | Employee creation fails |
| **S2-20** | **Logging out does not actually invalidate the token.** `POST /auth/logout` records it in `blacklisted_tokens`, but `middleware/auth.js` never checks that list | SEC | S | **Measured 2026-08-13:** logged in, logged out, then called `GET /auth/profile` with the same token — **200**. A JWT stays valid until it expires (1 day), so logout currently only clears the client's copy | Anyone who captured a token keeps access for up to a day after the user logs out. The table now exists and revocations are being recorded, so the middleware check can be added without a gap in the data |
| **S2-19** | **Receiving goods does not update stock.** `POST /grn` records the receipt but never touches `inventory` | BE-INV | M | **Measured 2026-08-13:** created a PO for 10 units, received all 10 via GRN — `available_quantity` stayed at 25. `grn.service.js` and `grn.repository.js` contain no reference to inventory or stock at all | The purchase cycle does not close. Stock has to be added by hand via `POST /inventory/in` after every delivery, so recorded stock drifts from reality. This is missing business logic, not a bug in existing code — it needs writing, so it is feature work rather than merge work |
| **S2-18** | `createAdvancePayment` partial writes — **half fixed** | BE-FIN | S | **Model level: FIXED.** The two inserts (`payments`, `payment_details`) now run in one transaction on a pooled connection, so a failure between them rolls back cleanly. **Service level: still open.** `payment.service.js` calls `cashBookService` *after* the model's transaction has already committed, so a cash-book failure still leaves a committed advance while the caller gets an error. Verified: a failing Cash advance leaves 1 orphan row | Remaining fix needs the cash-book write inside the same transaction, which requires `S0-7` first. Card/UPI/Bank advances are unaffected — only Cash touches the cash book |

---

# S3 — Medium

*Architecture and process debt. Nothing breaks today; every future change costs more.
Combined effort: ~30 days.*

| ID | Item | Area | Effort | Evidence | Rationale |
|:--:|---|:--:|:--:|---|---|
| **S3-1** | Merge `developer-purvansh` into the integration branch | INFRA | L | 23 route modules (inventory, products, purchase, GRN) in **no** integration branch | ~85% of a module is invisible to the build |
| **S3-2** | Decide TS vs JS and reset `main` to the surviving frontend | INFRA | L | `main` = TSX + react-query with 19 zero-byte files; `billing-integration` = JSX + zustand with 20+ real pages | Two frontends cannot be merged mechanically. **Recommend keeping JSX** |
| **S3-3** | Resolve the duplicated customer implementation | BE | M | `FIN/models/customerModel.js` vs `INV/repositories/customer.repository.js` | Two sources of truth for the customer record |
| **S3-4** | Resolve duplicated customer + supplier ledgers | BE | M | Both exist independently on FIN and INV | Same |
| **S3-5** | Settle on one backend architecture | BE | L | Three styles: ESM repository/service (INV), CommonJS model/service (FIN), flat controllers (HR) | Onboarding and review cost. **Recommend INV's pattern** |
| **S3-6** | Standardise the API response envelope | BE | M | `{success,data}` (FIN) · `ApiResponse` class (INV) · bare arrays (HR) | Frontend needs one contract before any wiring |
| **S3-7** | Settle on one API prefix (`/api/v1`) | BE | S | `/api/v1/*` (INV) vs `/api/*` (FIN, HR) | Must be fixed before the FE data layer is written |
| **S3-8** | Consolidate to one DB connection strategy (promise pool) | BE | M | Single `createConnection` (FIN) · promise pool (INV) · callback (HR) | FIN's single connection will not survive concurrency |
| **S3-9** | Merge the two competing axios instances | FE | XS | `api/axios.js` (:5005, no interceptor) vs `services/api.js` (:5005, with token interceptor) | Only one attaches the auth token |
| ~~**S3-10**~~ | ~~Reconcile the committed schema with whatever the team runs locally~~ | DB | — | **RESOLVED 2026-08-13.** Checked the live database directly: 87 tables in `database/*.sql`, 87 tables in the running DB, exact match. The schema files are correct and current | **No drift.** The code is simply wrong, not the schema. `database/` is trustworthy for rebuilding an environment |
| **S3-11** | Add a smoke-test script that hits every endpoint once | PROC | M | Zero test files in the repository | **This is what should have produced the status report** |
| **S3-12** | Write API documentation | PROC | M | None; `README.md` on `main` is 0 bytes | FE cannot integrate against undocumented contracts |
| **S3-13** | Redefine what ✅ means and re-baseline the status report | PROC | S | 6 zero-byte files currently sit inside ✅ rows | Root cause of the reporting gap |

---

# S4 — Low

*Genuinely unbuilt features. Real work, ordered by business value.
Combined effort: ~85 days — 59% of what remains.*

## S4-A — Frontend data layer *(highest business value in S4)*

| ID | Item | Area | Effort | Note |
|:--:|---|:--:|:--:|---|
| **S4-1** | Add a data-fetching layer and wire **billing** | FE | L | Backend is the most complete; `billingApi.js` already written |
| **S4-2** | Wire **payments** | FE | M | Backend ~95% |
| **S4-3** | Wire **customers** (list, detail, edit) | FE | M | Depends on S3-1 |
| **S4-4** | Wire the **dashboard** (18 widgets, all static) | FE | L | Depends on S0-7 |
| **S4-5** | Wire **suppliers** | FE | M | Depends on S3-1 |
| **S4-6** | Wire **customer orders** (5 pages, all static) | FE | M | Backend ~85%, unreported |
| **S4-7** | Build **ledger** screens (6) | FE | L | No pages exist at all |
| **S4-8** | Build **finance** screens (10) | FE | L | No pages exist at all |
| **S4-9** | Build **inventory** screens | FE | XL | No pages exist; backend has 23 modules ready |
| **S4-10** | Build **reports** UI + export triggers | FE | L | Backend ~70% |

> Measured baseline: **0 occurrences of `useEffect` in 82 frontend files.** This is not
> "integration in progress" — the data layer does not exist. Budget accordingly.

## S4-B — Unbuilt backend features

| ID | Item | Area | Effort | Note |
|:--:|---|:--:|:--:|---|
| **S4-11** | Notification & reminder engine (12 alert types) | BE | XL | The only correctly-reported 0%. Most *data sources* already exist (`/maker-assignments/delayed`, birthday/anniversary queries, low-stock) — needs a scheduler + dispatch + `sendEmail` wiring |
| **S4-12** | Remaining PIN protections (6 of 8) | BE-FIN | M | Discount, metal rate, backup restore, stock adjust, manual ledger, delete financial records. Cheap once S0-8 lands |
| **S4-13** | PIN attempt limiting / lockout | BE-FIN | S | `pin_attempts`, `pin_logs`, `security_pins` tables unused |
| **S4-14** | Role & permission management | BE+FE | L | `users.role` exists; no checks anywhere |
| **S4-15** | Financial / employee / gold-scheme reports | BE-FIN | L | Correctly reported ⏳ |
| **S4-16** | Attendance → salary integration + payslips | BE-HR | L | Depends on S2-1, S2-2, S2-7 |
| **S4-17** | Maker analytics endpoint | BE-FIN | S | `/makers/productivity` + `/performance` already cover most of it |

## S4-C — Dormant schema *(tables built, never used — cheap wins)*

`login_logs` · `user_sessions` · `audit_logs` · `activity_logs` · `error_logs` ·
`password_resets` · `employee_performance` · `employee_salary_logs` · `barcode_settings` ·
`backup_history` · `discount_approvals` · `discount_settings` · `financial_years` ·
`financial_settings` · `notification_settings` · `customer_order_measurements`

16 tables in a well-designed schema with no code behind them. Several (audit logs,
login logs, discount approvals) are S1-adjacent for a business handling gold and cash —
promote them if this goes to production.

---

# Master priority order

Ranked by severity, then by leverage (how much it unblocks per day spent).

| Rank | ID | Item | Sev | Effort |
|:--:|:--:|---|:--:|:--:|
| 1 | S1-1 | Rotate leaked credentials | S1 | XS |
| 2 | S0-3 | Install `bcryptjs` | S0 | XS |
| 3 | S0-2 | Fix frontend port | S0 | XS |
| 4 | S0-6 | Fix `CreateBill` import | S0 | XS |
| 5 | S0-4 | Fix JWT secret | S0 | XS |
| 6 | S0-5 | Fix JWT payload key | S0 | XS |
| 7 | S0-8 | `financial_security` → `financial_pin` | S0 | XS |
| 8 | S0-7 | `cash_book` → `cash_ledger` | S0 | S |
| 9 | S0-1 | Merge the two Express apps | S0 | M |
| 10 | S1-5 | `.gitignore` + untrack `node_modules` | S1 | XS |
| 11 | S1-2 | Purge `.env` from history | S1 | S |
| 12 | S2-3 | Quantity not multiplied into line total | S2 | XS |
| 13 | S1-4 | Mount `ProtectedRoute` | S1 | XS |
| 14 | S1-6 | Restrict CORS | S1 | XS |
| 15 | S2-14 | Rate-limit login | S2 | XS |
| 16 | S1-3 | Auth middleware on all business routes | S1 | M |
| 17 | S2-1 | Fix attendance table name | S2 | XS |
| 18 | S2-5 | Implement + mount `errorHandler` | S2 | S |
| 19 | S3-11 | Endpoint smoke-test script | S3 | M |
| 20 | S3-13 | Re-baseline the status report from that run | S3 | S |

Items 1–20 total **~9 dev-days** and take the project from *cannot run* to
*runs, is secure, and has a truthful status report*.

---

# Suggested sequencing

**Sprint 1 — "Make it run and make it safe"** *(~1 week, items 1–20)*
Exit criteria: log in through the UI · `GET /api/dashboard` returns real data ·
every business route rejects an unauthenticated request · no secrets in the repo ·
a smoke-test run produces the new status baseline.

**Sprint 2 — "Make the numbers true"** *(~2 weeks, remaining S1 + S2)*
Invoice sequencing, GST from `gst_rates`, invoice generator, validation, salary stubs,
the HR schema mismatches, export quality.

**Sprint 3 — "Unify the codebase"** *(~3 weeks, S3)*
Merge `developer-purvansh` · pick TS or JS and reset `main` · one architecture,
one response envelope, one API prefix, one connection strategy · resolve the three
duplicated modules · write the API docs the frontend will build against.

**Sprints 4+ — "Build the product"** *(S4)*
Frontend data layer module by module — billing → payments → customers → dashboard →
inventory — then the notification engine, roles, and remaining reports.

---

# Risk register

| Risk | Severity | Note |
|---|:--:|---|
| Leaked credentials already harvested | S1 | Assume compromised. Rotate regardless of whether the repo is private |
| Invoice numbering is not GST-compliant | S1 | `Date.now()` is not a gapless sequence. Regulatory, not just technical |
| Every financial endpoint is unauthenticated | S1 | Bills, payments, ledgers, customer KYC — all open |
| Multi-quantity bills undercharge | S2 | Silent revenue loss; will not surface until reconciliation |
| ~~Committed schema ≠ running schema~~ | — | **Closed 2026-08-13.** Verified equal (87 = 87 tables). The three missing tables are confirmed missing from the *live* database too, so `S0-7`/`S0-8` are real bugs — but `database/` is reliable |
| ~85% of a module lives on an unmerged branch | S3 | One force-push or stale clone from losing it |
| No tests, no CI, no API docs | S3 | Every regression here has been found by reading, not running |
