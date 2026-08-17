# JL Jewellers ERP — Verified Feature Status Audit

> # ⚠️ OUT OF DATE — HISTORICAL SNAPSHOT
>
> This is what the code looked like on **2026-08-13**, before the merge completed.
> It has **not** been updated since. Items it reports as broken — including the JWT
> signing bug and the committed `.env` — are fixed, and its **📦 Stranded** category
> is obsolete because those branches are now merged.
>
> **Do not use this as current status.** See
> [START-HERE.md](../../START-HERE.md) and
> [REMEDIATION_BACKLOG.md](../../REMEDIATION_BACKLOG.md).

Audit date: 2026-08-13 · Branches reviewed: `main`, `billing-integration`, `developer-purvansh`, `developer-riya`, `developer-aditya`, `frontend-vanshika`, `auth-integration`

This document is an independent, code-verified checklist. It records what the code
actually does, not what was reported. Every ⚠️ and ⛔ below is backed by a specific
file, table name, or line reference.

---

## Legend

| Mark | Meaning |
|:--:|---|
| ✅ | **Verified** — implemented, and consistent with the committed schema |
| 🟡 | **Partial** — implemented but incomplete or missing pieces |
| ⚠️ | **Built but broken** — code exists and will fail at runtime (wrong table/column, empty file, unresolvable import) |
| ⛔ | **Stub** — route is live but returns hardcoded/fake data, no DB access |
| ⏳ | **Not started** — no code |
| 📦 | **Stranded** — real code, but only on an unmerged branch; absent from every integration branch |

**Source columns:** `FIN` = finance/billing backend (`billing-integration`, `backend/src/`) ·
`INV` = inventory/party backend (`developer-purvansh`) ·
`HR` = auth/HR backend (`billing-integration`, `backend/` legacy + `developer-aditya`) ·
`UI` = frontend (`billing-integration`, `frontend/`)

> **Important:** no ✅ in this document means "tested". It means "the code is present and
> its SQL matches the schema". Nothing in this repository has verified runtime
> execution. See [Systemic Findings](#systemic-findings).
>
> **Update 2026-08-13 — schema findings now verified against the live database.**
> The running MySQL database was inspected directly: 87 tables, an exact match with
> `database/*.sql`. The three tables flagged below (`cash_book`, `financial_security`,
> `attendance`) are confirmed **absent from the real database**, and the correct names
> (`cash_ledger`, `financial_pin`, `employee_attendance`) are present. Every ⚠️ caused by
> those names is a confirmed defect, not a suspicion — and the committed schema is
> trustworthy.

---

## 0. Blockers — nothing else can be integrated until these are fixed

| # | Blocker | Evidence | Impact |
|:--:|---|---|---|
| B1 | Frontend calls port **5005**, backend serves on **5000** | `frontend/src/api/axios.js`, `frontend/src/services/api.js` vs `backend/src/server.js` (`PORT \|\| 5000`) | Every API call → `ERR_CONNECTION_REFUSED` |
| B2 | Two Express apps in one folder; only one can run | `backend/app.js` (auth) vs `backend/src/app.js` (finance, **no `/api/auth`**) | Login and billing can never both work |
| B3 | `bcryptjs` required but not installed | `backend/controllers/authController.js:2` vs `backend/package.json` (lists `bcrypt`) | Legacy auth server crashes on start |
| B4 | JWT signed with literal `"secret"`, verified with `process.env.JWT_SECRET` | `authController.js:29` vs `authMiddleware.js` | No issued token can ever pass verification |
| B5 | JWT payload uses `user.id`; PK is `user_id` | `authController.js:29` vs `users` schema | Token payload is `{id: undefined}` |
| B6 | Unresolvable import breaks the Vite build | `frontend/src/pages/billing/CreateBill.jsx:12` — `"../api/axios"` resolves to `src/pages/api/axios` | Build failure; should be `"../../api/axios"` |
| B7 | Table `cash_book` does not exist (schema has `cash_ledger`) | 9 queries in `cashBookModel.js`, `financeModel.js`, `dashboardModel.js` | Cash Book, Cash Flow, dashboard summary all 500 |
| B8 | Table `financial_security` does not exist (schema has `financial_pin`) | 4 queries in `financialSecurityModel.js` | Entire PIN module 500s |
| B9 | Table `attendance` does not exist (schema has `employee_attendance`) | all 3 handlers in `attendanceController.js` | Attendance module 500s |
| B10 | Column `employees.department_id` does not exist (schema has `department` varchar) | `employeeController.js` insert + join | Employee create/list 500 |
| B11 | No auth middleware on any business route | `backend/src/middleware/auth.js` is **0 bytes**; no route imports it | Every ERP endpoint is unauthenticated |
| B12 | `ProtectedRoute` never mounted | `frontend/src/routes/AppRouter.jsx` | Every page reachable without login |

> **CORS is not a blocker.** `backend/src/app.js:27` is `app.use(cors())` — fully open.
> The legacy app allows `http://localhost:5173`, Vite's default. The reported "CORS issue"
> is B1 (connection refused) surfacing as a CORS-shaped browser error.

---

## A. Authentication & Access Control

| Feature | FE | BE | Src | Remarks |
|---|:--:|:--:|:--:|---|
| Login UI | ✅ | — | UI | `pages/auth/Login.jsx` + `AuthCard`/`LoginForm`/`ShowroomBackground`. Complete |
| JL Jewellers branding | ✅ | — | UI | Logo assets, `constants/theme.js` |
| Responsive auth layout | ✅ | — | UI | `layouts/AuthLayout.jsx` |
| Login API call | ✅ | ⚠️ | UI/HR | **The only working FE↔BE integration in the repo.** Backend blocked by B3/B4/B5 |
| Password hashing | — | ✅ | HR | `bcryptjs.hash(password, 10)` — correct |
| Invalid credential handling | ✅ | ✅ | HR | 404 user-not-found / 400 bad-password. Note: distinct codes leak account existence |
| JWT issuance | — | ⚠️ | HR | B4 + B5. Token is issued but structurally unusable |
| JWT verification middleware | — | 🟡 | HR | `authMiddleware.js` is correct code, but applied only to HR routes |
| Token storage & attach | ✅ | — | UI | `store/authStore.js` + `services/api.js` request interceptor. Well done |
| Logout | ✅ | ⏳ | UI | Client-side only. `user_sessions` table exists, unused |
| Protected routes | ⚠️ | ⚠️ | UI/FIN | `ProtectedRoute.jsx`/`PublicRoute.jsx` exist but are **never imported** (B12). Backend: B11 |
| Register | — | ✅ | HR | Present; not exposed in UI |
| Password reset | ⏳ | ⏳ | — | `password_resets` table exists; `utils/sendEmail.js` exists but unwired |
| Role / permission management | ⏳ | ⏳ | — | `users.role` column exists. No role checks anywhere |
| Login / session audit logs | ⏳ | ⏳ | — | `login_logs`, `user_sessions`, `audit_logs` tables exist, all unused |

**Module verdict:** UI complete, backend structurally broken. Reported as ✅/✅ — **overstated**.

---

## B. Dashboard

| Feature | FE | BE | Src | Remarks |
|---|:--:|:--:|:--:|---|
| Dashboard layout & shell | ✅ | — | UI | `DashboardLayout`, `Sidebar`, `Topbar`. Good quality |
| KPI / stat card components | ✅ | — | UI | `StatsCard`, `SummarySection`, `MetalCard` — **static JSX, no props from API** |
| `GET /api/dashboard` (summary) | ⏳ | ⚠️ | FIN | Real 13KB `dashboardModel.js`, but summary query hits `cash_book` (B7) → 500 |
| Today's sales | ⏳ | ⚠️ | FIN | Inside the blocked summary query |
| Today's bills | ⏳ | ⚠️ | FIN | Inside the blocked summary query |
| Revenue | ⏳ | ⚠️ | FIN | Inside the blocked summary query |
| Profit | ⏳ | ⚠️ | FIN | Inside the blocked summary query |
| Cash flow | ⏳ | ⚠️ | FIN | Directly depends on `cash_book` (B7) |
| Pending payments | ⏳ | ⚠️ | FIN | Inside the blocked summary query |
| Pending orders | ⏳ | ⚠️ | FIN | Inside the blocked summary query |
| Inventory value / quantity | ⏳ | ⚠️ | FIN | Inside the blocked summary query |
| Gold rate widget | ⏳ | 🟡 | FIN | No dedicated endpoint — one field in the summary payload. `MetalRateCard` is static |
| Silver rate widget | ⏳ | 🟡 | FIN | Same as above |
| Recent bills | ⏳ | ✅ | FIN | `getRecentBills()` — valid SQL. `RecentBills.jsx` static |
| Recent activities | ⏳ | ✅ | FIN | `getRecentActivities()` — valid SQL. `RecentActivities.jsx` static |
| Low stock products | ⏳ | ✅ | FIN | `getLowStockProducts()` — valid SQL. `LowStockProducts.jsx` static |
| Top selling products | ⏳ | ✅ | FIN | `getTopSellingProducts()` — valid SQL. `TopSellingProducts.jsx` static |
| Sales overview chart | ⏳ | ✅ | FIN | `getSalesOverview()`. `SalesOverview.jsx` static; `recharts` installed, unused |
| `GET /dashboard/sales-analytics` | ⏳ | ✅ | FIN | Date-range filtered, valid tables |
| `GET /dashboard/inventory` | ⏳ | ✅ | FIN | Valid |
| `GET /dashboard/stock-movement` | ⏳ | ✅ | FIN | Valid |

**Module verdict:** BE ≈ 70% (good code, one bad table name takes down the main endpoint).
FE data layer ≈ 0% — reported as "🔄 API Integration", actually **not started**.

---

## C. Billing Engine

| Feature | FE | BE | Src | Remarks |
|---|:--:|:--:|:--:|---|
| `POST /api/bills` — create | ⚠️ | ✅ | FIN/UI | Transactional insert, columns match `bills` exactly. FE blocked by B6 |
| `PUT /api/bills/:id` — edit | ⏳ | ✅ | FIN | Guarded by `requireFinancialPinForCompletedBill` |
| `PUT /:id/cancel` | ⏳ | ⚠️ | FIN | Guarded by `verifyFinancialPin` → blocked by B8 |
| `PUT /:id/status` | ⏳ | ✅ | FIN | Valid |
| `DELETE /:id` | ⏳ | ✅ | FIN | Soft delete via `deleted_at`/`deleted_by` |
| `GET /api/bills` — list | ⏳ | ✅ | FIN | `AllBills.jsx` renders static rows |
| `GET /:id` — detail | ⏳ | ✅ | FIN | Valid |
| `GET /search` | ⏳ | ✅ | FIN | `InvoiceHistory.jsx` static |
| `GET /:id/history` | ⏳ | ✅ | FIN | Backed by `bill_history` table |
| Draft / Completed / Cancelled views | ⏳ | ✅ | UI/FIN | `bill_status` enum supports it; 3 UI pages exist, all static |
| Multiple bill items | ⚠️ | ✅ | FIN/UI | `bill_items` insert loop is correct; `CreateBill.jsx` has working local item state |
| Weight calculations | ⚠️ | ✅ | FIN | `billingCalculator.js` `net_weight * rate` |
| Quantity handling | ⚠️ | 🟡 | FIN | `quantity` is passed through but **not multiplied into the line total** — likely a real bug |
| Rate calculations | ⚠️ | ✅ | FIN | Correct |
| Making charges | ⚠️ | ✅ | FIN | Percentage-based, correct |
| GST calculation | ⚠️ | 🟡 | FIN | **`utils/gstCalculator.js` is 0 bytes.** GST hardcoded 3%/5% inline in `billingCalculator.js`; the `gst_rates` table is unused |
| Discount | ⚠️ | ✅ | FIN | Applied post-GST at line level |
| Taxable value | ⚠️ | ✅ | FIN | metal + making, correct |
| Grand total | ⚠️ | ✅ | FIN | Correct |
| Invoice number generation | — | 🟡 | FIN | `"INV-" + Date.now()` — the `invoice_sequence` and `invoice_settings` tables are unused. Not GST-compliant sequencing |
| Print invoice | ⏳ | ⚠️ | FIN | **`utils/invoiceGenerator.js` is 0 bytes.** `GET /:id/print` returns JSON, not a document |
| Discount approval workflow | ⏳ | ⏳ | — | `discount_approvals`, `discount_settings` tables exist, unused |

**Module verdict:** the strongest backend module — BE ≈ 85%, not 100%.
Two empty files sit directly under features reported as ✅.

---

## D. Payments

| Feature | FE | BE | Src | Remarks |
|---|:--:|:--:|:--:|---|
| `POST /api/payments` — record | ⏳ | ✅ | FIN | `paymentModel.js` 16KB, `paymentService.js` 11KB. Substantial, tables valid |
| Cash / Card / UPI / Bank mode | ⏳ | ✅ | FIN | Handled via `payment_details`; schema-backed |
| Partial payments | ⏳ | ✅ | FIN | Drives `bills.payment_status` = Partial |
| Mixed payments | ⏳ | ✅ | FIN | Multiple `payment_details` rows per payment |
| `GET /pending/:bill_id` | ⏳ | ✅ | FIN | Valid |
| `POST /advance` | ⏳ | ✅ | FIN | Valid |
| `GET /advance/:customer_id` | ⏳ | ✅ | FIN | Valid |
| `POST /adjust-advance` | ⏳ | ✅ | FIN | Advance→bill adjustment. Good design |
| `POST /refund` | ⏳ | ✅ | FIN | Backed by `refunds` table |
| `GET /refund-history` | ⏳ | ✅ | FIN | Valid |
| `GET /history` | ⏳ | ✅ | FIN | Valid |
| `GET /receipt/:payment_id` | ⏳ | 🟡 | FIN | Returns JSON; no printable receipt |
| Payments UI | ⏳ | — | UI | `pages/payments/Payments.jsx` — static, zero API calls |

**Module verdict:** the most defensible ✅ in the original report. BE ≈ 95%. FE 0%.

---

## E. Ledger

| Feature | FE | BE | Src | Remarks |
|---|:--:|:--:|:--:|---|
| `POST /api/ledger` — customer entry | ⏳ | ✅ | FIN | `ledgerModel.js` 5.7KB |
| `GET /:customer_id` | ⏳ | ✅ | FIN | Valid |
| `GET /:customer_id/statement` | ⏳ | ✅ | FIN | Valid |
| `GET /:customer_id/outstanding` | ⏳ | ✅ | FIN | Valid |
| `POST /supplier` | ⏳ | ✅ | FIN | Valid |
| `GET /supplier/:id` + `/outstanding` | ⏳ | ✅ | FIN | Valid |
| Customer ledger (duplicate impl.) | ⏳ | ✅📦 | INV | `customerLedger.*` also exists on `developer-purvansh` — **two competing implementations** |
| Supplier ledger (duplicate impl.) | ⏳ | ✅📦 | INV | Same duplication |
| Cash ledger | ⏳ | ⚠️ | FIN | Reached through Cash Book → B7 |
| Bank ledger | ⏳ | 🟡 | FIN | `bank_accounts` endpoint only; `bank_ledger` table unused |
| Daily ledger | ⏳ | 🟡 | FIN | No dedicated endpoint; approximated by cash book statement |
| Expense ledger | ⏳ | 🟡 | FIN | `expenses` covered; `expense_ledger` table unused |
| Manual ledger entry + PIN guard | ⏳ | ⏳ | — | Listed under §N in the original report; no implementation |
| Ledger UI (all 6 screens) | ⏳ | — | UI | No pages exist. Router shows a "under development" placeholder |

**Module verdict:** BE ≈ 75%, not 100%. Ledger duplication across two branches is an
unresolved merge decision.

---

## F. Finance

| Feature | FE | BE | Src | Remarks |
|---|:--:|:--:|:--:|---|
| `POST /api/income` + history + by-id | ⏳ | ✅ | FIN | Valid tables |
| `POST /api/expenses` + history + by-id | ⏳ | ✅ | FIN | Valid tables |
| `GET /api/cashbook/statement` | ⏳ | ⚠️ | FIN | B7 — `cash_book` doesn't exist |
| `GET /finance/profit-loss` | ⏳ | 🟡 | FIN | Partially depends on `cash_book` |
| `GET /finance/summary/profit-loss` | ⏳ | 🟡 | FIN | Same |
| `GET /finance/cash-flow` | ⏳ | ⚠️ | FIN | B7 — direct dependency |
| `GET /finance/summary/cash-flow` | ⏳ | ⚠️ | FIN | B7 |
| `GET /finance/balance-sheet` | ⏳ | ✅ | FIN | Includes receivables inline |
| `GET /finance/gst-summary` | ⏳ | ✅ | FIN | Valid |
| `GET /finance/bank-accounts` | ⏳ | ✅ | FIN | Read-only; no CRUD |
| `GET /finance/outstanding-payables` | ⏳ | ✅ | FIN | Valid |
| Outstanding receivables | ⏳ | 🟡 | FIN | **No standalone endpoint** — only a `receivables` field inside balance-sheet. Reported as ✅ |
| `GET /finance/dashboard` | ⏳ | 🟡 | FIN | Overlaps `/api/dashboard` — duplicated responsibility |
| Financial years | ⏳ | ⏳ | — | `financial_years`, `financial_settings` tables exist, unused |
| Finance UI (10 screens) | ⏳ | — | UI | None exist |

**Module verdict:** BE ≈ 60%, not 100%. Four of ten reported-complete features are
blocked by one wrong table name.

---

## G. Customer Management

| Feature | FE | BE | Src | Remarks |
|---|:--:|:--:|:--:|---|
| Create customer | ⏳ | ✅📦 | INV | Auto-generates `CUS000001` code. Clean service layer |
| List (search/filter/sort/paginate) | ⏳ | ✅📦 | INV | `sortBy` correctly whitelisted; all values parameterised |
| Get by ID | ⏳ | ✅📦 | INV | Valid |
| Update (partial) | ⏳ | ✅📦 | INV | Valid |
| Soft delete | ⏳ | ✅📦 | INV | Valid |
| Activate / reactivate | ⏳ | ✅📦 | INV | `PATCH /:id/activate` |
| Customer documents — upload | ⏳ | ✅📦 | INV | `multer` configured (`config/multer.js`), `/uploads` served statically |
| Documents — list / view / download | ⏳ | ✅📦 | INV | All four routes present |
| Documents — soft delete | ⏳ | ✅📦 | INV | Valid |
| Customer notes CRUD | ⏳ | ✅📦 | INV | Valid |
| Loyalty — earn / redeem / history | ⏳ | ✅📦 | INV | Backed by `customer_loyalty` |
| VIP management + VIP list | ⏳ | ✅📦 | INV | Valid |
| Purchase history / LTV | ⏳ | ✅📦 | INV | `customerAnalytics.*` |
| Birthday / anniversary tracking | ⏳ | ✅📦 | INV | **Exists** — reported as ⏳ under §M Notifications |
| Duplicate customer model | — | ⚠️ | FIN | `FIN/models/customerModel.js` is a second, competing implementation |
| Customer UI — list | ⏳ | — | UI | `Customers.jsx` static |
| Customer UI — detail | ⏳ | — | UI | `CustomerDetails.jsx` static |
| Customer UI — edit | ⏳ | — | UI | `EditCustomer.jsx` static |

**Module verdict:** best-engineered backend in the project — but **📦 stranded on
`developer-purvansh`, present in no integration branch**. FE reported "🔄 API Integration";
actual API calls: **zero**.

---

## H. Supplier Management

| Feature | FE | BE | Src | Remarks |
|---|:--:|:--:|:--:|---|
| Supplier CRUD | ⏳ | ✅📦 | INV | Full: `repository` 3.5KB + `service` 3.7KB. Reported as 🔄 — **understated** |
| Activate / deactivate | ⏳ | ✅📦 | INV | `PATCH /:id/activate` |
| Search / filtering / pagination | ⏳ | ✅📦 | INV | Present in the repository layer. Reported as ⏳ — **understated** |
| Supplier documents (4 routes) | ⏳ | ✅📦 | INV | Upload / list / view / download / soft delete |
| Supplier ledger + balance | ⏳ | ✅📦 | INV | Reported ⏳ — **understated**; also duplicated in FIN |
| Supplier payments CRUD | ⏳ | ✅📦 | INV | `supplierPayment.*`, 3KB repository |
| Supplier UI | ⏳ | — | UI | `Suppliers.jsx` static, no API calls |

**Module verdict:** backend ≈ 85%, materially more complete than reported.

---

## I. Inventory Management

> This section was reported as **⏳ Pending**. It is the single most understated area
> in the report — 23 route modules exist on `developer-purvansh`.

| Feature | FE | BE | Src | Remarks |
|---|:--:|:--:|:--:|---|
| `GET /inventory` — current stock | ⏳ | ✅📦 | INV | `inventory.repository.js` 5.3KB |
| `POST /inventory/in` — stock in | ⏳ | ✅📦 | INV | **Exists.** Reported ⏳ |
| `POST /inventory/out` — stock out | ⏳ | ✅📦 | INV | **Exists.** Reported ⏳ |
| `POST /inventory/adjust` | ⏳ | ✅📦 | INV | **Exists.** Reported ⏳ |
| `GET /inventory/movements` | ⏳ | ✅📦 | INV | Backed by `stock_movements` |
| `GET /inventory/low-stock` | ⏳ | ✅📦 | INV | Also mirrored on the FIN dashboard |
| Products CRUD | ⏳ | ✅📦 | INV | `product.repository.js` 4.4KB |
| Product variants | ⏳ | ✅📦 | INV | Full sub-resource |
| Product barcodes | ⏳ | 🟡📦 | INV | Route exists; `barcode_settings` table unused |
| Product images | ⏳ | ✅📦 | INV | Route + multer |
| Categories / subcategories | ⏳ | ✅📦 | INV | Full CRUD both |
| Designs | ⏳ | ✅📦 | INV | Full CRUD |
| Purity | ⏳ | ✅📦 | INV | Full CRUD |
| Metal types / stone types | ⏳ | ✅📦 | INV | Full CRUD both |
| Purchase orders + status | ⏳ | ✅📦 | INV | `repository` 4.9KB |
| Purchase returns | ⏳ | ✅📦 | INV | Full CRUD |
| GRN (goods receipt) + status | ⏳ | ✅📦 | INV | `grn.repository.js` 6.1KB — largest repository in the project |
| Inventory valuation | ⏳ | ✅ | FIN | Via `/dashboard/inventory` |
| Gold / Silver / Platinum stock | ⏳ | ✅📦 | INV | `/inventory-analytics/gold`,`/silver`,`/platinum`. Reported ⏳ — **understated** |
| Diamond / stone stock | ⏳ | ✅📦 | INV | Present |
| Dead stock / fast / slow moving | ⏳ | ✅📦 | INV | Present. Reported 🔄 |
| Overstock / stock aging | ⏳ | ✅📦 | INV | Present |
| Inventory UI | ⏳ | — | UI | **No pages exist.** Router shows a placeholder. Reported 🔄 In Development |

**Module verdict:** BE ≈ 85% and stranded; FE 0% (reported as "in development" — there is
no inventory page in the codebase).

---

## J. Customer Orders & Makers (Karigars)

> **This entire area is missing from the original status report.** It is implemented.

| Feature | FE | BE | Src | Remarks |
|---|:--:|:--:|:--:|---|
| Create / list / get customer order | ⏳ | ✅ | FIN | `customerOrderModel.js` 7.8KB |
| Update order | ⏳ | ✅ | FIN | Valid |
| Cancel order | ⏳ | ✅ | FIN | `PATCH /:id/cancel` |
| Deliver order | ⏳ | ✅ | FIN | `PATCH /:id/deliver`, writes `order_status_history` |
| Order measurements | ⏳ | 🟡 | FIN | `customer_order_measurements` table exists; partial coverage |
| Maker CRUD + deactivate | ⏳ | ✅ | FIN | `makerModel.js` 8.5KB |
| Maker productivity / performance | ⏳ | ✅ | FIN | Endpoints exist — relevant to §L "Maker Analytics ⏳" |
| Maker payment ledger | ⏳ | ✅ | FIN | Backed by `maker_payments` |
| Maker assignment create/list | ⏳ | ✅ | FIN | `makerAssignmentModel.js` 6.3KB |
| Pending / delayed assignments | ⏳ | ✅ | FIN | Feeds the unbuilt "Maker Delay Alerts" |
| Assignment status update | ⏳ | ✅ | FIN | Valid |
| Orders UI (5 pages) | ⏳ | — | UI | Orders/Create/Update/Cancel/Delivery — all static |
| Makers UI | ⏳ | — | UI | Placeholder route only |

**Module verdict:** BE ≈ 85%, entirely unreported. FE 0%.

---

## K. Gold Scheme

> **Also missing from the original report** except as "Gold Scheme Report ⏳".
> `goldSchemeModel.js` is **24.5KB — the largest single file in the repository.**

| Feature | FE | BE | Src | Remarks |
|---|:--:|:--:|:--:|---|
| Scheme types CRUD + deactivate | ⏳ | ✅ | FIN | 4 endpoints |
| Enrollments — create / list / get | ⏳ | ✅ | FIN | Backed by `gold_scheme_enrollments` |
| Installment payment | ⏳ | ✅ | FIN | `POST /installments/pay` |
| Installment schedule | ⏳ | ✅ | FIN | `GET /enrollments/:id/installments` |
| Missed installments | ⏳ | ✅ | FIN | `GET /installments/missed` |
| Scheme ledger | ⏳ | ✅ | FIN | `GET /enrollments/:id/ledger` |
| Maturity processing | ⏳ | ✅ | FIN | `POST /maturity/:enrollmentId` |
| Maturity alerts | ⏳ | ⏳ | — | Data is there; no notification engine |
| Gold scheme report | ⏳ | ⏳ | — | Correctly reported ⏳ |
| Gold scheme UI | ⏳ | — | UI | Placeholder route only |

**Module verdict:** BE ≈ 90%, unreported. FE 0%.

---

## L. Employee, Attendance & Salary

| Feature | FE | BE | Src | Remarks |
|---|:--:|:--:|:--:|---|
| Employee create | ⏳ | ⚠️ | HR | B10 — inserts non-existent `department_id` |
| Employee list | ⏳ | ⚠️ | HR | B10 — joins on non-existent column |
| Employee update / delete | ⏳ | 🟡 | HR | Present, same column risk |
| Department CRUD | ⏳ | ✅ | HR | `departmentController.js` 2KB, columns match |
| Check-in | ⏳ | ⚠️ | HR | B9 — table `attendance` doesn't exist. **Reported ✅ Completed** |
| Check-out | ⏳ | ⚠️ | HR | B9. **Reported ✅ Completed** |
| Attendance list | ⏳ | ⚠️ | HR | B9 + joins `employees.name` (that column does exist) |
| Attendance status (present/absent/leave) | ⏳ | ⏳ | — | Schema enum exists; no code sets it |
| Salary — generate | ⏳ | ⛔ | HR | **Hardcoded `{success:true}`.** No DB access |
| Salary — slip | ⏳ | ⛔ | HR | Echoes back the URL params |
| Salary — list all | ⏳ | ⛔ | HR | Hardcoded string |
| Salary — PDF | ⏳ | ⛔ | HR | Hardcoded string |
| Salary schema | — | ✅ | DB | `employee_salary_logs` exists and is unused |
| Monthly salary calculation | ⏳ | ⏳ | — | Not started |
| Attendance → salary integration | ⏳ | ⏳ | — | Not started |
| Employee performance | ⏳ | ⏳ | — | `employee_performance` table unused |
| Employee/Salary UI | ⏳ | — | UI | No pages, no placeholder route |

**Module verdict:** the weakest module. Attendance reported ✅ but cannot execute;
Salary is four stub handlers behind live authenticated routes.

---

## M. Reports & Exports

| Feature | FE | BE | Src | Remarks |
|---|:--:|:--:|:--:|---|
| Sales report | ⏳ | ✅ | FIN | `reportModel.js` 11KB, valid tables |
| GST report | ⏳ | ✅ | FIN | Valid |
| Customer report | ⏳ | ✅ | FIN | Valid |
| Ledger report | ⏳ | ✅ | FIN | Valid |
| Payment report | ⏳ | ✅ | FIN | Valid |
| Inventory report | ⏳ | ✅ | FIN | Valid |
| Financial report | ⏳ | ⏳ | — | Correctly reported ⏳ |
| Employee report | ⏳ | ⏳ | — | Correctly reported ⏳ |
| Gold scheme report | ⏳ | ⏳ | — | Correctly reported ⏳ |
| PDF export | ⏳ | 🟡 | FIN | `pdfExport.js` dumps raw `key : value` pairs — not a formatted report |
| Excel export | ⏳ | 🟡 | FIN | `exceleExport.js` (sic — typo in filename), 734 bytes, minimal |
| CSV export | ⏳ | ✅ | FIN | `json2csv`, straightforward |
| Duplicate export surface | — | ⚠️ | FIN | Both `/api/reports/export/*` and `/api/export/*` exist and overlap |
| Reports UI | ⏳ | — | UI | Placeholder route only |

**Module verdict:** BE ≈ 70% (report claimed 75% — closest estimate in the document,
though export quality is overstated).

---

## N. Business Intelligence

> Reported as **0% / Not Started**. In fact `analyticsRoutes.js` implements
> **eight of the nine listed features**, and `analyticsModel.js` (9KB) queries only
> real tables — so this module should actually run.

| Feature | FE | BE | Src | Remarks |
|---|:--:|:--:|:--:|---|
| Sales vs target | ⏳ | ✅ | FIN | `GET /analytics/sales-target` |
| Revenue comparison | ⏳ | ✅ | FIN | `GET /analytics/revenue-comparison` |
| Monthly revenue | ⏳ | ✅ | FIN | `GET /analytics/monthly-revenue` |
| Yearly revenue | ⏳ | ✅ | FIN | `GET /analytics/yearly-revenue` |
| Profit trends | ⏳ | ✅ | FIN | `GET /analytics/profit-trends` |
| Customer analytics | ⏳ | ✅ | FIN | `GET /analytics/customer-analytics` |
| Inventory analytics | ⏳ | ✅ | FIN | `GET /analytics/inventory-analytics` + 11 richer endpoints on INV |
| Financial analytics | ⏳ | ✅ | FIN | `GET /analytics/financial-analytics` |
| Maker analytics | ⏳ | 🟡 | FIN | No dedicated endpoint, but `/makers/productivity` + `/makers/performance` cover most of it |
| BI dashboard UI | ⏳ | — | UI | None. `recharts` is installed and unused |

**Module verdict:** BE ≈ 90%, reported as 0%. Someone built this and it was never
credited. FE 0%.

---

## O. Notification & Reminder Engine

| Feature | FE | BE | Src | Remarks |
|---|:--:|:--:|:--:|---|
| All 12 listed alert types | ⏳ | ⏳ | — | No scheduler, no job runner, no dispatch code |
| `notifications` table | — | ✅ | DB | Exists, unused |
| `notification_settings` table | — | ✅ | DB | Exists, unused |
| Birthday / anniversary data source | — | ✅📦 | INV | `customerAnalytics` already provides the queries |
| Low-stock data source | — | ✅ | FIN/INV | Two implementations already exist |
| Maker-delay data source | — | ✅ | FIN | `/maker-assignments/delayed` already exists |
| Email transport | — | 🟡 | HR | `utils/sendEmail.js` (775 bytes) exists, wired to nothing |

**Module verdict:** correctly reported as **0%** — the only fully accurate 0% in the
document. Note that most of the *data* it needs is already built.

---

## P. Financial Security PIN

> Reported as **0% / Not Started**. In reality the module is built and already wired
> into billing — it just queries a table that doesn't exist (B8).

| Feature | FE | BE | Src | Remarks |
|---|:--:|:--:|:--:|---|
| `POST /financial-security/set-pin` | ⏳ | ⚠️ | FIN | bcrypt-hashed PIN. B8 |
| `POST /verify-pin` | ⏳ | ⚠️ | FIN | B8 |
| `PATCH /change-pin` | ⏳ | ⚠️ | FIN | Requires old PIN. B8 |
| `GET /` + `PATCH /settings` | ⏳ | ⚠️ | FIN | B8 |
| Edit completed bill protection | ⏳ | ⚠️ | FIN | `requireFinancialPinForCompletedBill` **is mounted** on `PUT /bills/:id` |
| Cancel completed bill protection | ⏳ | ⚠️ | FIN | `verifyFinancialPin` **is mounted** on `PUT /bills/:bill_id/cancel` |
| FE passes PIN on cancel | 🟡 | — | UI | `billingApi.cancelBill(billId, financialPin)` already accepts it |
| PIN attempt limiting / lockout | ⏳ | ⏳ | — | `pin_attempts`, `pin_logs`, `security_pins` tables unused |
| Large discount protection | ⏳ | ⏳ | — | Not started |
| Metal rate change protection | ⏳ | ⏳ | — | Not started |
| Restore backup protection | ⏳ | ⏳ | — | Not started (`backup_history` table unused) |
| Manual stock adjustment protection | ⏳ | ⏳ | — | `POST /inventory/adjust` exists unguarded |
| Manual ledger entry protection | ⏳ | ⏳ | — | `POST /api/ledger` exists unguarded |
| Delete financial records protection | ⏳ | ⏳ | — | `DELETE /bills/:id` exists unguarded |
| PIN entry UI | ⏳ | — | UI | No modal/component |

**Module verdict:** BE ≈ 55%, reported as 0%. Fixing one table name activates
two live protections.

---

## Q. Architecture & Infrastructure

| Item | Status | Src | Remarks |
|---|:--:|:--:|---|
| Node + Express server | ⚠️ | — | **Two apps in one folder** (B2). Only one can run |
| MySQL integration | ⚠️ | — | Three different connection styles: single `createConnection` (FIN), promise pool (INV), callback (HR) |
| Environment configuration | ⚠️ | — | `.env` **committed with live credentials** on `main` and `developer-purvansh` |
| `.gitignore` | ⚠️ | — | **0 bytes on `main`** → `node_modules/` is committed. Correct on `billing-integration` |
| MVC layering | 🟡 | — | Three incompatible architectures across three developers |
| Route layer | ✅ | — | Present in all three backends |
| Controller layer | ✅ | — | Present in all three backends |
| Service layer | 🟡 | — | FIN + INV only; HR has none |
| Repository layer | 🟡📦 | INV | **Only on `developer-purvansh`** — in no integration branch |
| Validation middleware | ⚠️ | FIN | **`validate.js` is 0 bytes.** No validation library anywhere in the project |
| Error handling | ⚠️ | FIN | **`errorHandler.js` is 0 bytes** and never mounted. INV has a real one |
| CORS | ✅ | — | Working — and therefore *not* the integration bug |
| Helmet | ✅ | — | Mounted on FIN and INV |
| Morgan logging | ✅ | — | Mounted on FIN and INV |
| Rate limiting | 🟡 | FIN | `rateLimiter.js` global only; not applied to auth specifically |
| API response standardisation | ⚠️ | — | Three formats: `{success,data}` (FIN), `ApiResponse` class (INV), bare arrays (HR) |
| API versioning | ⚠️ | — | `/api/v1/*` (INV) vs `/api/*` (FIN, HR) |
| Auth middleware on business routes | ⚠️ | — | B11 — none, anywhere |
| Automated tests | ⏳ | — | Zero test files in the repository |
| API documentation | ⏳ | — | None. `README.md` on `main` is 0 bytes |
| CI / lint gate | ⏳ | — | ESLint configured in the frontend only; not enforced |

---

## R. Frontend Data Layer — measured

| Metric | Count | Note |
|---|:--:|---|
| Frontend source files | 82 | `billing-integration` |
| Files that import an API client | **2** | `LoginForm.jsx`, `CreateBill.jsx` (the latter has a broken path) |
| Occurrences of `useEffect` in the entire frontend | **0** | No component fetches on mount |
| Occurrences of `fetch(` | **0** | — |
| API client modules written | 3 | `api/axios.js`, `services/api.js`, `api/billingApi.js` — **two competing axios instances** |
| API client modules that are empty | 1 | `services/dashboard.service.js` (0 bytes) |
| Page components | 20+ | All render static markup |
| State management | ✅ | `zustand` — `authStore` is genuinely well written |
| Data-fetching library | ⏳ | None installed on this branch (`main` has `react-query`, but `main` has no pages) |

**Conclusion:** every row reported as "🔄 API Integration" should read **⏳ Pending**.
There is no partial integration to finish; it has not been started.

---

## Systemic Findings

1. **✅ has been used to mean "the file exists", not "the endpoint returns correct data."**
   Six 0-byte files currently sit inside rows marked ✅: `validate.js`, `errorHandler.js`,
   `auth.js`, `gstCalculator.js`, `invoiceGenerator.js`, `exportModel.js`.

2. **Nothing has been run against the database.** Three non-existent tables
   (`cash_book`, `financial_security`, `attendance`) and one non-existent column
   (`employees.department_id`) are referenced by code marked complete. A single
   successful request to any of those endpoints would have caught it.

3. **Unmerged work is invisible and uncredited.** The entire inventory/product/purchase
   backend (23 modules, `developer-purvansh`) is in no integration branch, and was
   reported as ⏳ Pending. Conversely, Business Intelligence (8/9 features) and the
   Financial Security PIN (6 endpoints) were reported as 0% while being largely built.

4. **`main` is a regression.** It holds a TypeScript rewrite with 19 tracked 0-byte
   files and a login page — while 170 files of working code sit on `billing-integration`.
   The two frontends (TSX+react-query vs JSX+zustand) cannot be merged mechanically.

5. **Three modules are implemented twice** — customer, customer ledger, supplier ledger
   exist independently on both `billing-integration` and `developer-purvansh`.

---

## Corrected Completion Summary

| Area | Reported | Verified | Delta |
|---|:--:|:--:|:--:|
| Billing engine (BE) | 100% | ~85% | −15 |
| Payments (BE) | 100% | ~95% | −5 |
| Ledger (BE) | 100% | ~75% | −25 |
| Finance (BE) | 100% | ~60% | −40 |
| Dashboard (BE) | 100% | ~70% | −30 |
| Customer (BE) | Complete | ~90% 📦 | stranded |
| Supplier (BE) | In dev | ~85% 📦 | **+** |
| Inventory (BE) | Pending | ~85% 📦 | **+** |
| Customer orders / makers (BE) | *unreported* | ~85% | **+** |
| Gold scheme (BE) | *unreported* | ~90% | **+** |
| Business intelligence (BE) | 0% | ~90% | **+** |
| Financial security PIN (BE) | 0% | ~55% | **+** |
| Reports (BE) | 75% | ~70% | −5 |
| Attendance (BE) | Complete | ~0% (broken) | −100 |
| Salary (BE) | In dev | ~0% (stubs) | − |
| Notifications (BE) | 0% | 0% | ✓ accurate |
| **Backend overall** | ~"strong" | **~50%** | — |
| **Frontend UI shell** | Complete | ~65% | −35 |
| **Frontend data layer** | "In development" | **~2%** | −large |
| **FE↔BE integration** | "In development" | **~2%** (login only, JWT broken) | −large |

---

## Suggested Rebuild Order

**Phase 0 — Foundation (nothing else works until this is done)**
Resolve B1–B6 · single Express app on a single port · fix the JWT secret and payload ·
`npm i bcryptjs` · fix the `CreateBill` import · add a Vite proxy · rotate the committed
credentials and write a real `.gitignore`.

**Phase 1 — Make the existing backend actually run**
Fix the three table names and one column name · mount a real `errorHandler` · write
`auth.js` and apply it to every business route · then hit every endpoint once and record
which return 200. That run — not a file listing — becomes the real status report.

**Phase 2 — Merge the stranded work**
Bring `developer-purvansh` into the integration branch · resolve the three duplicated
modules (customer, customer ledger, supplier ledger) · settle on one architecture,
one response envelope, one API prefix.

**Phase 3 — Build the frontend data layer**
It does not exist yet. Pick one axios instance, add a fetching library, and wire modules
in order: billing → payments → customers → dashboard → inventory.

**Phase 4 — Finish genuinely-pending features**
Notification engine (0%, correctly reported) · salary module (stubs) · remaining PIN
protections · financial/employee/gold-scheme reports · role & permission management.

---

## Correction log

Findings from earlier sessions that later evidence overturned. Kept visible rather than
quietly edited, because knowing *why* an audit was wrong is as useful as the audit.

| Item | Originally said | Actually | Why the mistake |
|---|---|---|---|
| S0-4 / S0-5 JWT bugs | Broken everywhere | **Already fixed** on `billing-integration`; still broken on `main` and `developer-aditya` | The audit read `main`'s copy of `authController.js`. Six branches, three different versions of the same file |
| S2-2 employees `department_id` | Employee list would fail | `GET /api/employees` returns **200** | Two different employee controllers. The broken one is on `developer-aditya`, not on the running branch. Real bug, wrong location |
| S3-10 schema drift | Possible mismatch between the SQL files and the real database | **No drift** — 87 tables both sides, exact match | Resolved by inspecting the live database directly |

Three findings that only appeared once the code was actually run, and which no amount of
reading would have caught: S2-15 (payments column), S2-16 (income column),
S2-17 (employee role column).
