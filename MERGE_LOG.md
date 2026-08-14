# Merge Log

One entry per module, recorded as it lands. The rule from
[MERGE_PLAN.md](MERGE_PLAN.md): **a module is merged when its endpoints answer
correctly, not when the code is in the folder.** Every entry below carries the endpoint
results that prove it.

- **Plan and decisions** → [MERGE_PLAN.md](MERGE_PLAN.md)
- **Everything else changed** → [CHANGES.md](CHANGES.md)
- **Outstanding work** → [REMEDIATION_BACKLOG.md](REMEDIATION_BACKLOG.md)

---

## Scope rule for this phase

**Merging what exists. Not writing new features.**

| In scope | Out of scope |
|---|---|
| Moving files into the module structure | Writing features that don't exist |
| Converting `require` → `import` | New endpoints |
| Patch/glue code so modules fit together | New business logic |
| Fixing wrong table and column names | Rebuilding stub modules from scratch |
| Repointing to the shared pool and error handler | New UI screens |

**Deferred by this rule:** the salary module. Its four endpoints return a hardcoded
`{success: true}` and never touch the database, so "merging" it would mean authoring it.
It stays on `auth-integration` until feature work resumes.

---

## Status board

| # | Module | Source | Converted | Mounted | Swept | Status |
|:--:|---|---|:--:|:--:|:--:|---|
| 0 | Foundation | shared | ✅ | ✅ | ✅ | **merged — 0 regressions** |
| 1 | billing | Riya | ✅ | ✅ | ✅ | **merged — 2 real bugs fixed** |
| 2 | payments | Riya | ✅ | ✅ | ✅ | **merged — S2-15 fixed; advances blocked on a schema decision** |
| 3 | ledger | Riya | ⏳ | ⏳ | ⏳ | not started |
| 4 | finance | Riya | ⏳ | ⏳ | ⏳ | not started |
| 5 | reports + analytics | Riya | ⏳ | ⏳ | ⏳ | not started |
| 6 | orders + makers | Riya | ⏳ | ⏳ | ⏳ | not started |
| 7 | schemes | Riya | ⏳ | ⏳ | ⏳ | not started |
| 8 | security (PIN) | Riya | ⏳ | ⏳ | ⏳ | not started |
| 9 | masters | Purvansh | n/a | ⏳ | ⏳ | not started |
| 10 | customers | Purvansh | n/a | ⏳ | ⏳ | not started |
| 11 | suppliers | Purvansh | n/a | ⏳ | ⏳ | not started |
| 12 | products | Purvansh | n/a | ⏳ | ⏳ | not started |
| 13 | inventory | Purvansh | n/a | ⏳ | ⏳ | not started |
| 14 | purchase | Purvansh | n/a | ⏳ | ⏳ | not started |
| 15 | auth | auth-integration | ⏳ | ⏳ | ⏳ | not started |
| 16 | hr (no salary) | auth-integration | ⏳ | ⏳ | ⏳ | not started |
| — | ~~salary~~ | auth-integration | — | — | — | **deferred — would need writing** |

Purvansh's modules need no conversion; they are already ESM.

---

## Method — best of everything, not one branch's version

Modules are **not** inherited wholesale from whichever branch happened to be merged
first. For each one, every branch that contains an implementation is compared, and the
best is taken — judged on correctness against the live schema, then on error handling,
validation and structure.

That means a module can come from a branch nobody thought of as "the" source, and two
adjacent modules can come from different developers. Author is not a tiebreaker.

### Source scour — completed 2026-08-13

Every branch checked for work not already captured in an integration branch.

| Branch | Unique work? | Verdict |
|---|---|---|
| `developer-riya` | **None** — `backend/src` is byte-identical to `billing-integration` | Nothing stranded |
| `developer-purvansh` | **All 100 files** — in no integration branch | The big find. Phase B |
| `developer-aditya` | One file differs from `auth-integration`: `authController.js` | Its version is **worse** — see below |
| `auth-integration` | Fuller auth + HR | **Best auth controller** — see below |
| `main` | Nothing. Strictly behind on backend; frontend is an empty TS scaffold | Discard |
| `frontend-vanshika` | Superseded by `billing-integration` (23 files fewer) | Discard |

### Decision: `authController.js` — four versions compared

| Version | Endpoints | Correct against schema? |
|---|:--:|---|
| `main` | 2 | ❌ signs with the literal `"secret"`; reads `user.id` |
| `billing-integration` *(currently running)* | 2 | ✅ correct secret and `user_id`; handles DB errors |
| `developer-aditya` | **6** | ❌ `SELECT id FROM users` and `user.id` — that column does not exist |
| **`auth-integration`** ← **taken** | **6** | ✅ correct `user_id`, plus the same DB error handling |

`auth-integration`'s version is a strict superset of the one currently running: identical
correctness and error handling, plus `getProfile`, `logout`, `changePassword` and
`resetPassword`.

**Note the trap this avoids.** Aditya's branch looks fuller than what we run — six
endpoints against two — but queries a column that does not exist, so four of the six
would fail at runtime. "More endpoints" and "better" are not the same thing, and only
checking against the live schema separates them.

### Duplicate implementations — decided per module

| Module | Candidates | Taken | Why |
|---|---|---|---|
| customers | `billing-integration` `customerModel.js` · `developer-purvansh` `customer.repository.js` | **Purvansh** | Documents, notes, loyalty, VIP, analytics and ledger behind it. The other is a thin helper for billing |
| customer ledger | both | **Riya** *(pending phase A verification)* | Covers all six ledger types; Purvansh's covers only the two party ledgers |
| supplier ledger | both | **Riya** *(same)* | Same reason |
| auth controller | four branches | **auth-integration** | See above |

Opposite directions on purpose. Each judged on its own merits.

---

## Baseline before any merging — measured 2026-08-13

The reference every conversion is checked against. If a module's result changes from
this after conversion, the conversion broke something.

### Answering

| Endpoint | Result |
|---|:--:|
| `GET /api/bills` | 200 |
| `GET /api/reports/sales` | 200 |
| `GET /api/analytics/monthly-revenue` | 200 |
| `GET /api/customer-orders` | 200 |
| `GET /api/makers` | 200 |
| `GET /api/gold-schemes/types` | 200 |
| `GET /api/employees` | 200 |
| `POST /api/auth/login` | 200 · rejects a bad password with 400 |

### Failing, with cause

| Endpoint | Error | Backlog |
|---|---|:--:|
| `GET /api/dashboard` | `Table 'cash_book' doesn't exist` | `S0-7` |
| `GET /api/cashbook/statement` | `Table 'cash_book' doesn't exist` | `S0-7` |
| `GET /api/finance/balance-sheet` | `Table 'cash_book' doesn't exist` | `S0-7` |
| `GET /api/finance/cash-flow` | `Table 'cash_book' doesn't exist` | `S0-7` |
| `GET /api/financial-security/` | `Table 'financial_security' doesn't exist` | `S0-8` |
| `GET /api/payments/history` | `Unknown column 'p.customer_id'` | `S2-15` |
| `GET /api/income/history` | `Unknown column 'income_date'` | `S2-16` |

Per the "fix each module as it lands" policy, these are repaired as their module is
merged — they are rename-level fixes to existing code, so they fall inside the scope rule.

---

## Entries

Each module gets an entry in this shape as it lands:

```
### N. <module>            <date>
Source      : which branch / folder it came from
Files       : how many moved, how many converted
Patch code  : any glue written to make it fit, and why
Fixed       : bugs repaired on the way in, with backlog IDs
Endpoints   : every route called, with the actual result
Verdict     : merged / merged with known issues / rolled back
```

---

### 0. Foundation — ✅ MERGED · 2026-08-13

**Result: 0 regressions.** 17 endpoints answering (was 8 measured, sweep widened to 24
routes), 7 still failing with byte-identical causes to the baseline.

**Files**

| Piece | Source | Note |
|---|---|---|
| `config/db.cjs` | patch code | One `mysql2` pool exposed as both callback and promise APIs |
| `config/db.js` | patch code | Thin ESM shim over `db.cjs` so already-ESM code imports naturally |
| `utils/ApiError.js` | Purvansh | as-is |
| `utils/ApiResponse.js` | Purvansh | as-is |
| `utils/asyncHandler.js` | Purvansh | as-is |
| `middleware/errorHandler.js` | Purvansh | replaces a 0-byte file |
| `middleware/auth.js` | existing `authMiddleware.js` | moved + converted to ESM. Replaces a 0-byte file. **Not yet applied to routes** — that is `S1-3` and would make every module sweep fail for the wrong reason |
| `app.js` | rewritten | ESM, mounts everything under `/api/v1` |
| `server.js` | rewritten | ESM, real startup DB check, binds loopback |

**The .cjs bridge**

`package.json` flipped to `"type": "module"`. Because that flag is per-package, all 83
CommonJS files broke at once. They were renamed to `.cjs` — Node treats those as
CommonJS regardless of the flag, and ESM can import them.

| Step | Count |
|---|:--:|
| Finance files bridged to `.cjs` | 76 |
| Legacy auth/employee files bridged | 7 |
| Internal `require` paths rewritten to name `.cjs` | 85 |

Node resolves `.js`/`.json`/`.node` automatically but **not** `.cjs`, so every relative
require had to name the extension. Scripted, then verified — 0 unqualified relative
requires remain.

This is the mechanism that makes module-by-module conversion possible: the app runs
throughout, and each module converts from `.cjs` to real ESM on its own turn. When the
last `.cjs` disappears, the bridge is gone.

**Patch code written (all glue, no features)**

1. **Dual-API database module.** Riya's models call `pool.query(sql, params, cb)`;
   Purvansh's repositories `await pool.execute(...)`. `mysql2`'s `.promise()` gives both
   views of one pool, so neither side's logic changes and there is still only one pool.
2. **ESM shim over the CJS database module.** CommonJS cannot `require()` ESM, so the real
   implementation must stay `.cjs` until the last consumer converts.
3. **`/api` alias alongside `/api/v1`.** Decision 4 moves everything to `/api/v1`; the old
   prefix is served too so the frontend keeps working until it is repointed. Temporary.

**Known incomplete — carried forward honestly**

- **Decision 2 is only half done.** `db.cjs` still exports a second, dedicated
  `connection` because four files open transactions via `connection.beginTransaction()`,
  which a pool has no equivalent for. Those four — `billModel`, `goldSchemeModel`,
  `customerOrderService`, `makerAssignmentService` — get patched to `pool.getConnection()`
  when their own module lands. Until then there are 2 connections, not 1.
- **The legacy `backend/config/db.cjs` is a third pool**, used by auth/employees. It goes
  when auth moves into `modules/` in phase C.
- **`/api` alias still live.** Removed once the frontend moves to `/api/v1`.

**Fixed on the way in**

- `S1-3` (partially, and by a better route): `server.js` now binds `127.0.0.1` instead of
  all interfaces. **Verified: the API was reachable at `http://172.31.240.1:5000/api/bills`
  returning real billing data to anything on the WiFi; it is now refused.** For a
  single-operator desktop app this closes the actual exposure. Route-level auth remains
  worth doing as defence in depth.
- The startup DB check now runs a real `SELECT 1`. The old code called `createPool()` and
  logged "MySQL Connected ✅" unconditionally — it printed with MySQL stopped.

**Sweep** — `node scripts/sweep.cjs http://127.0.0.1:5000/api/v1`

```
24 routes checked
17 OK          (200)
 7 still broken (same causes as baseline — S0-7, S0-8, S2-15, S2-16)
 0 regressions
```

Full-stack re-verified: `npm run dev` cold-starts MySQL, backend and frontend; login
through the Vite proxy returns 200; `/api/v1/bills` returns 200; LAN access refused.

`vite.config.js` proxy target changed from `localhost:5000` to `127.0.0.1:5000` — with the
API on loopback IPv4 only, "localhost" resolving to `::1` on Windows would have broken
every proxied call.

**Verdict: merged.**

---

### 1. Billing — ✅ MERGED · 2026-08-13

**Source:** `billing-integration` (Riya). Confirmed by the scour to be the only
implementation — `developer-riya` is byte-identical, no other branch has a billing module.

**Files** — 5 converted to ESM and moved to `src/modules/billing/`

| New | From |
|---|---|
| `bill.routes.js` | `routes/billRoutes.cjs` |
| `bill.controller.js` | `controllers/billController.cjs` |
| `bill.service.js` | `services/billingService.cjs` |
| `bill.model.js` | `models/billModel.cjs` |
| `billing.calculator.js` | `utils/billingCalculator.cjs` |

---

#### Bug 1 — bills could be reported as saved when nothing was written

`createBill` opened a transaction, inserted the `bills` row, and then **resolved the
promise immediately — before inserting the bill items and before `COMMIT`.** A second
`resolve()` after the commit did nothing, because a promise only settles once.

So if the `bill_items` insert failed, the transaction rolled back correctly — but the
caller had *already* been told `"Bill created successfully."` with a `bill_id`. The user
sees a successful bill; the database has nothing.

Fixed: the premature resolve is gone. The only success path is now after a confirmed
commit.

#### Bug 2 — a regression phase 0 introduced, and why the sweep missed it

`db.cjs` exported the **pool** as its default. A pool has no `beginTransaction()` — that
has to be pinned to a single connection. So from the moment phase 0 landed, every
transaction path in the app was broken:

```
billModel · goldSchemeModel · customerOrderService · makerAssignmentService
```

**The endpoint sweep reported all green throughout.** Every transaction sits behind a
POST or PUT, and the sweep only called GETs. A read-only test suite cannot see a broken
write path.

Fixed two ways:
1. `db.cjs` now defaults to the single connection again, so unconverted CommonJS behaves
   exactly as before.
2. `scripts/sweep-writes.cjs` added — it creates a real bill, **verifies the items
   actually committed**, checks an empty bill is rejected, then cleans up after itself.
   Every module from here is checked against both sweeps.

This is the more useful of the two findings. The first was a latent bug; the second was a
gap in how we were verifying, which would have kept hiding bugs of that shape.

---

**Patch code**

- Both transactions (`createBill`, `updateBill`) now take a connection from the shared
  pool via `getConnection()` and release it on every exit path — success, failure and
  rollback. Two of the four outstanding transaction sites are done; `goldSchemeModel` and
  `customerOrderService` follow with their own modules.
- Default exports added alongside named exports. CommonJS `module.exports = {...}`
  supports both `require("x").a` and destructuring; ESM `export {}` does not, so
  consumers using `import x from` would break. Emitting both lets modules convert one at
  a time without rewriting every importer in the same step.
- Dead code removed: `billModel` had **two** `module.exports =` blocks, the first
  silently overwritten by the second. Verified the second was a superset before dropping
  the first — nothing was lost.

**Deprecated shadows — deliberate, short-lived**

`billModel.cjs`, `billingService.cjs` and `billingCalculator.cjs` still exist, because
two unconverted modules require them and **CommonJS cannot require ESM**, so a re-export
shim is impossible:

```
paymentService.cjs                      -> billModel.cjs
requireFinancialPinForCompletedBill.cjs -> billingService.cjs
```

All three carry a DEPRECATED header. Billing logic exists in two places until payments
and security convert — fixes go in `modules/billing/`. `billRoutes.cjs` and
`billController.cjs` had no remaining consumers and were deleted.

**Sweeps**

```
read  : 24 routes, 17 OK, 7 known-broken, 0 regressions
write : POST /bills                      PASS  (bill_id created)
        -> items actually committed      PASS  (1 item)
        -> empty bill rejected           PASS
        0 failures
```

**Known, not fixed** — an empty bill is rejected with a **500** rather than a 400. It is
correctly refused, but the status code is wrong. Fixing it means adding validation, which
is new code and outside this phase's scope. Logged for feature work.

**Verdict: merged.**

---

### 2. Payments — ✅ MERGED · 2026-08-13

**Source:** `billing-integration` (Riya). Only implementation in the project.

**Files** — 4 converted to ESM under `src/modules/payments/`: `payment.routes.js`,
`payment.controller.js`, `payment.service.js`, `payment.model.js`.

#### `S2-15` fixed — for 3 of 4 affected functions

The model queried `p.customer_id`, which does not exist on `payments`. Real columns:

```
payment_id, bill_id, payment_date, total_amount, payment_status,
payment_type, created_by, updated_by, created_at, updated_at
```

A payment belongs to a **bill**, and the bill knows the customer. Three functions were
already joining `bills` and hedging with `COALESCE(p.customer_id, b.customer_id)` — the
original author half-expected this. Dropping the phantom half fixes them outright:

| Endpoint | Before | After |
|---|:--:|:--:|
| `GET /payments/history` | 400 `Unknown column 'p.customer_id'` | **200** |
| `GET /payments/refund-history` | (untested) | **200** |
| `GET /payments/receipt/:id` | (untested) | **200** |
| `GET /payments/pending/:bill_id` | — | 404 "Bill not found" — correct for a missing bill |

Baseline in `scripts/sweep.cjs` updated so these are now *expected* to pass — reintroducing
the bug would show as a regression.

#### Blocked — the advance-payment feature needs a schema change

Four functions implement advances, and they need **two columns that do not exist**:

| Column | Used by | Purpose |
|---|---|---|
| `payments.customer_id` | `createAdvancePayment`, `createAdvanceAdjustmentPayment`, `getCustomerAdvance` | An advance is taken from a *customer* before any bill exists, so it cannot hang off `bill_id` |
| `payments.is_adjusted` | `adjustAdvancePayment`, `getCustomerAdvance` | Marks an advance as consumed, so it is not spent twice |

This is not a rename and there is no workaround — an advance genuinely has no bill to
join through. The code is fully written; the schema never caught up.

`GET /payments/advance/:customer_id` remains **500**, recorded as an expected failure in
the sweep. Awaiting a decision on whether to add the columns.

**Patch code**

- Customer resolved via `bills` in three queries, with the reason in a SQL comment
- `payment.service.js` now imports the converted `modules/billing/bill.model.js`, not the
  deprecated shadow

**Shadow files**

Deleted: the four old payment `.cjs` files, now orphaned.
`billModel.cjs` **could not** be deleted — `billingService.cjs` also requires it, which I
missed on the first pass. Deleting it broke startup; the sweep caught it inside a minute
and it was restored. Both shadows go when the security module converts.

**Sweeps**

```
read  : 28 routes, 20 OK, 8 known-broken, 0 regressions
write : 3/3 pass
```

**Verdict: merged**, with the advance feature explicitly blocked rather than quietly broken.

#### Follow-up · advance payments unblocked · migration `2026-08-13_01`

Approved and applied. Two columns added to `payments`:

| Column | Definition |
|---|---|
| `customer_id` | `INT NULL`, FK to `customers` — set only for advances |
| `is_adjusted` | `TINYINT(1) NOT NULL DEFAULT 0` — marks an advance as consumed |

Plus index `idx_payments_customer_advance (customer_id, payment_type, is_adjusted)`.

**This completed an intended design rather than inventing one.** `payments.bill_id` was
already nullable and `payment_type` already contained `'Advance'` as an enum value — both
only make sense if a payment can exist without a bill. The columns were simply never added.

Additive only, no rows rewritten, and the migration is guarded so re-running is harmless.
`database/03_developer1_finance.sql` and `05_foreign_keys.sql` updated so the schema files
stay the source of truth.

**Verified by round trip, not just a status code.** A 200 on the read proves nothing — an
empty list is also a 200. The write sweep now creates a real advance and reads it back,
asserting the count actually increased (`1 -> 2`). Test rows were removed afterwards.

#### `S2-18` found while testing — advances are not transactional

The first attempt used `payment_method: "Cash"`, which failed at the cash-book step. On
inspecting the database:

```
payment_id 16 | customer_id 3 | 5000.00 | Advance   <- written
payment_detail_id 15 | Cash                          <- written
```

**The API returned an error to the caller, and both rows were committed anyway.** There is
no transaction around advance creation, so the payment succeeded, the cash-book write
failed, and nothing rolled back. The customer's money is recorded while the app reports
failure.

Same family as the billing bug fixed in module 1 — and it makes the case that write-path
testing should have existed from the start. Logged as `S2-18`, to be fixed together with
`S0-7` since they are coupled.

The advance write test uses `Card` for now to isolate the feature from the cash-book
blocker, with a comment to switch it back to `Cash` once that is resolved.

#### `S0-7` reclassified — the cash book is not a rename

Checked against the live database:

| | Columns |
|---|---|
| Real `cash_ledger` | `cash_entry_id, transaction_date, transaction_type, amount, description, created_at` |
| Code writes to `cash_book` | `transaction_type, source, reference_id, customer_id, amount, remarks, created_by` |

Only `transaction_type` and `amount` overlap. A find-and-replace would fail on the first
insert. Backlog updated from "rename, S effort" to "needs a decision, M effort".

---

### 0. Foundation — superseded detail

**Goal:** the shared floor every module stands on — one pool, one error handler, one
response shape, one auth middleware, and the `src/modules/` structure.

| Piece | Source | Note |
|---|---|---|
| `config/db.js` | new glue over both | One `mysql2` pool exposing callback **and** promise APIs, so Riya's callback models and Purvansh's async repositories both run off it unchanged |
| `utils/ApiError.js` | Purvansh | as-is |
| `utils/ApiResponse.js` | Purvansh | as-is |
| `utils/asyncHandler.js` | Purvansh | as-is |
| `middleware/errorHandler.js` | Purvansh | replaces the 0-byte file |
| `middleware/auth.js` | existing `authMiddleware.js` | moved, not written — the 0-byte file is replaced by working code that already exists |

**Patch code in this stage:** the dual-API database module. This is glue, not a feature —
it exists purely so two existing coding styles can share one connection pool instead of
opening two.

Endpoint results to follow once mounted.
