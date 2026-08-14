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
| 3 | ledger | **Riya** (over Purvansh) | ✅ | ✅ | ✅ | **merged — duplicate resolved on evidence** |
| 4 | finance | Riya | ✅ | ✅ | ✅ | **merged — S0-7 and S2-16 resolved, 8 endpoints unblocked** |
| 5 | reports + analytics + exports + dashboard | Riya | ✅ | ✅ | ✅ | **merged — S2-11 resolved, exports proven to produce real files** |
| 6 | orders + makers | Riya | ✅ | ✅ | ✅ | **merged — 4 transaction sites pooled via a shared helper** |
| 7 | schemes | Riya | ✅ | ✅ | ✅ | **merged — last 3 transaction sites pooled** |
| 8 | security (PIN) | Riya | ✅ | ✅ | ✅ | **merged — S0-8 resolved. PHASE A COMPLETE** |
| 9 | masters | Purvansh | n/a | ✅ | ✅ | **merged — worked first time, never run before** |
| 10 | customers | Purvansh | n/a | ✅ | ✅ | **merged — 1 systemic bug fixed across 17 sites** |
| 11 | suppliers | Purvansh | n/a | ✅ | ✅ | **merged — supplier payments deferred to purchase (real dependency)** |
| 12 | products | Purvansh | n/a | ✅ | ✅ | **merged — cross-module validation working** |
| 13 | inventory | Purvansh | n/a | ✅ | ✅ | **merged — reported "Pending", was complete** |
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

**`S2-18` half fixed — and the half that remains is worth being precise about.**

*Model level — fixed.* `createAdvancePayment` now wraps both inserts in one transaction
on a pooled connection, same pattern as billing. A failure between the `payments` and
`payment_details` inserts rolls back cleanly instead of leaving money on record with no
idea how it was taken.

*Service level — still open.* `payment.service.js` calls `cashBookService` **after** the
model's transaction has already committed. So a Cash advance still commits, then fails at
the cash book, and the caller gets an error for a payment that was saved. Re-tested after
the fix: a failing Cash advance still leaves **1** orphan row.

Fixing that needs the cash-book write inside the same transaction, which cannot happen
until `S0-7` is decided. Card, UPI and Bank Transfer advances are unaffected — only Cash
touches the cash book.

Recorded as half-done rather than closed. Claiming `S2-18` fixed on the strength of the
model change would have been wrong, and the orphan check is what caught it.

#### `S0-7` reclassified — the cash book is not a rename

Checked against the live database:

| | Columns |
|---|---|
| Real `cash_ledger` | `cash_entry_id, transaction_date, transaction_type, amount, description, created_at` |
| Code writes to `cash_book` | `transaction_type, source, reference_id, customer_id, amount, remarks, created_by` |

Only `transaction_type` and `amount` overlap. A find-and-replace would fail on the first
insert. Backlog updated from "rename, S effort" to "needs a decision, M effort".

---

### 3. Ledger — ✅ MERGED · 2026-08-13

**The duplicate, settled on evidence.** Two implementations existed. The choice was not
close, and the deciding evidence came from Purvansh's own code comments:

```js
// Since there is no dedicated customer_ledger or customer_payments table yet,
// we derive the outstanding balance from the customer_orders table.

// Without a payments/ledger table, we can only list the orders as debit
// transactions. Once the finance module is complete, this query should UNION
// with customer_payments.
```

**`customer_ledger` does exist**, and Riya's module was already writing to it. Purvansh
wrote a documented stopgap against `customer_orders` for a table that was already there,
because the branches never met.

| | Riya | Purvansh |
|---|---|---|
| Source tables | `customer_ledger`, `supplier_ledger` — the real ones | `customer_orders` only |
| Coverage | 7 functions: create/read/statement/outstanding for both customer and supplier | 2 read-only functions |
| Completeness | Full | Author-flagged as temporary |

**Taken: Riya's.** Purvansh's is superseded — and its own author expected it to be.

This is the clearest single illustration of what the merge is worth. Two people solved the
same problem twice, one of them worked around a table his teammate was already using, and
neither knew.

**Files** — 4 converted to ESM under `src/modules/ledger/`: `ledger.routes.js`,
`ledger.controller.js`, `ledger.service.js`, `ledger.model.js`.

**Repointed** — `bill.service.js` and `payment.service.js` now import
`../ledger/ledger.service.js` instead of the bridged `.cjs`.

**Endpoints** — all five verified live:

```
GET /ledger/:customer_id                200
GET /ledger/:customer_id/statement      200
GET /ledger/:customer_id/outstanding    200
GET /ledger/supplier/:id                200
GET /ledger/supplier/:id/outstanding    200
```

Added to the sweep baseline so a regression would be caught.

**Write path confirmed indirectly** — creating a bill writes a `customer_ledger` row, which
is how the test residue below was noticed. The ledger is genuinely wired into billing, not
just readable.

**Cleanup** — `ledgerController.cjs` and `ledgerRoutes.cjs` deleted. `ledgerService.cjs`
and `ledgerModel.cjs` kept: the deprecated `billingService.cjs` shadow still requires them.
That shadow chain now unwinds entirely when the security module converts.

**Test residue found and dealt with.** Each write-sweep run left behind soft-deleted bills
plus their `bill_items` and `customer_ledger` rows — none of which have delete endpoints.
Nine ledger rows had accumulated. Purged, and the sweep script now documents the residue
and carries the SQL to clear it. Soft-delete is correct for financial records; the point
is that test runs must not quietly pollute the data they are measuring.

**Sweeps**

```
read  : 33 routes, 25 OK, 8 known-broken, 0 regressions
write : 5/5 pass
database left clean: 15 bills, 19 bill_items, 30 ledger rows, 15 payments
```

**Verdict: merged.**

---

### 4. Finance — ✅ MERGED · 2026-08-13

The biggest single unblock so far. **16 files** converted to ESM under
`src/modules/finance/` — cash book, expenses, income and the finance summaries —
and two migrations that between them turned 8 failing endpoints into working ones.

#### `S0-7` resolved — migration `2026-08-13_02`

The long-standing "rename `cash_book` → `cash_ledger`" turned out not to be a rename.
Only `transaction_type` and `amount` overlapped. `cash_ledger` was extended to the shape
the code actually writes:

```
+ source        where the entry came from (Bill, Advance Payment, Expense …)
+ reference_id  the id of that source record
+ customer_id   the customer involved, when there is one
+ created_by    the employee who recorded it
~ description -> remarks
```

**Which name won, and why.** `cash_ledger` — it belongs to a family already in the schema
(`bank_ledger`, `customer_ledger`, `supplier_ledger`, `expense_ledger`) whereas `cash_book`
sits outside it. The 9 code references were changed instead of renaming the table to suit
the code.

Conditions were ideal: `cash_ledger` had **0 rows** and **0 code references**, so nothing
could be disturbed.

#### `S2-16` resolved — migration `2026-08-13_03`

`income` and `expenses` are the same kind of record and the code treats them as a pair.
The schema did not:

```
expenses  expense_id, expense_type,  amount, expense_date,  remarks
income    income_id,  income_source, amount, received_date, remarks
```

The code writes `income_type` / `income_date` — mirroring expenses — plus `payment_method`
and `created_by` to **both**, none of which existed. Renaming income's two columns rather
than changing the code left the tables symmetric, which is what the code and common sense
both expect:

```
expenses  expense_id, expense_type, amount, payment_method, expense_date, remarks, created_by
income    income_id,  income_type,  amount, payment_method, income_date,  remarks, created_by
```

`income` was empty, so the renames were free.

#### Endpoints unblocked

| Endpoint | Before | After |
|---|:--:|:--:|
| `GET /dashboard` | 500 `cash_book` | **200** |
| `GET /cashbook/statement` | 400 `cash_book` | **200** |
| `GET /finance/balance-sheet` | 500 `cash_book` | **200** |
| `GET /finance/cash-flow` | 500 `cash_book` | **200** |
| `GET /finance/profit-loss` | (blocked) | **200** |
| `GET /finance/summary/cash-flow` | (blocked) | **200** |
| `GET /income/history` | 400 `income_date` | **200** |
| `GET /expenses/history` | — | **200** |

**The dashboard now answers.** That was the single most visible failure in the whole audit.

#### `S2-18` — the Cash path now works end to end

The advance test was switched back from Card to **Cash**, the longest path in the system:
it writes a payment, its detail, and a `cash_ledger` entry across two modules. Verified:

```
POST /payments/advance {payment_method:"Cash"}  ->  201
cash_ledger: Cash In | Advance Payment | ref 22 | customer 3 | 2500.00
```

The observed failure is gone. **The structural point stands, though:** the cash-book write
still happens after the payment's transaction commits, so a future failure there would
still leave a committed payment. Lower priority now that the path works, but not closed —
kept in the backlog rather than quietly marked done.

#### Cleanup

16 superseded `.cjs` files deleted. `dashboardModel.cjs` — not yet converted — had its
`cash_book` references repointed so the dashboard works now rather than waiting for
module 5. **Zero `cash_book` references remain anywhere in the codebase.**

Bridge is shrinking: **53 `.cjs` files left**, down from 83.

#### A miss worth recording

`expense.service.js` and `income.service.js` both import `cashBookService`, which I had not
mapped before converting — the server failed to start. Fixed in a minute, but it is the
second time a cross-module import has been missed. Worth listing every importer *before*
converting, not after.

**Sweeps**

```
read  : 36 routes, 33 OK, 3 known-broken, 0 regressions
write : 5/5 pass, including the full Cash advance path
database left clean: 15 bills, 15 payments, 0 cash_ledger, 33 customer_ledger
```

**Verdict: merged.**

---

### 5. Reports, analytics, exports, dashboard — ✅ MERGED · 2026-08-13

**16 files** converted into two modules: `src/modules/reports/` (reports, analytics,
exports) and `src/modules/dashboard/`. Dashboard was split out — it is a distinct concern
with its own model, not a report.

**Lesson applied.** Every importer in the group was mapped *before* converting, after
missing cross-imports twice. The group turned out to be self-contained, and the conversion
started first time.

#### Exports genuinely work — and produce real files

This module was rated "PDF export 🟡, quality overstated" in the audit. Measured:

| Endpoint | Result |
|---|---|
| `GET /export/csv?report=sales` | 200 · 1,970 bytes · `text/csv` |
| `GET /export/pdf?report=gst` | 200 · 5,223 bytes · `application/pdf` |
| `GET /export/excel?report=inventory` | 200 · 7,848 bytes · `…spreadsheetml.sheet` |

Real files with correct content types, across all three formats and multiple report types.
**Note the parameter is `report=`, not `type=`** — worth knowing before anyone wires the UI.

#### `S2-11` resolved — and the duplicate had never worked

The audit flagged two overlapping export surfaces. Testing showed it was worse than
duplication:

```js
report.controller.js  ->  exportService.exportPDF()    // does not exist
export.service.js     ->  exports exportToPDF()        // the real name
```

`/reports/export/pdf`, `/excel` and `/csv` called three functions that do not exist. **All
three returned 500 on every request and had never worked once.**

Removed rather than repaired. Two export surfaces doing the same job drift apart, the
`/export/*` one demonstrably works, and nothing could have depended on handlers that only
ever produced errors. Verified: the removed paths now 404, the working ones still return
files.

#### Dead code removed

`utils/csvExport.cjs`, `exceleExport.cjs` and `pdfExport.cjs` had **no importers** —
`export.service.js` implements all three formats directly against `pdfkit`, `exceljs` and
`json2csv`. `models/exportModel.cjs` was a 0-byte file. All four deleted.

#### A mistake worth recording

I first tried to strip the three dead handlers with a regex. It failed to match the
functions but *did* match inside a method call, turning
`await exportService.exportCSV(req.query)` into `await exportService.(req.query)` —
a syntax error. Regenerated the file from source and used exact-text edits instead.

Scripted edits are fine for mechanical, uniform changes like `require` → `import`. For
anything that needs judgement about structure, hand-editing is safer — a regex that
half-matches is worse than one that does not match at all.

#### Cleanup

19 files deleted (16 superseded, 3 dead utils). Bridge down to **34 `.cjs` files from 83**.

**Sweeps**

```
read  : 47 routes, 44 OK, 3 known-broken, 0 regressions
write : 5/5 pass
database left clean
```

Only the three financial-security endpoints still fail — module 8, which also unwinds the
last deprecated shadow chain.

**Verdict: merged.**

---

### 6. Orders and makers — ✅ MERGED · 2026-08-13

**12 files** converted into `src/modules/orders/` and `src/modules/makers/`. Makers and
maker-assignments share a module — an assignment only exists in relation to a maker.

#### `utils/withTransaction.js` — new shared helper

Four transaction sites had to move onto pooled connections (three in orders: create,
cancel, deliver; one in maker assignments). Rather than paste the same twenty lines of
`getConnection` / `release` / `rollback` boilerplate a fourth, fifth, sixth and seventh
time, it is now one helper:

```js
const createOrder = (data) =>
    withTransaction(async (db, resolve, reject) => {
        try {
            const id = await model.insert(db, data);
            db.commit((err) => err ? db.rollback(() => reject(err)) : resolve(id));
        } catch (error) {
            db.rollback(() => reject(error));
        }
    });
```

`resolve` and `reject` release the connection for you, and are guarded so calling either
twice cannot double-release. **That guard matters:** a missed `release()` leaks a
connection permanently, and once the pool is exhausted the entire app hangs with no error
message. Hand-copied boilerplate is exactly where that mistake gets made.

This also retires the copies written by hand in billing and payments as a pattern — future
transaction sites use the helper.

#### All 4 remaining transaction sites now pooled

| Site | Status |
|---|---|
| `billModel.createBill` / `updateBill` | pooled (module 1) |
| `paymentModel.createAdvancePayment` | pooled (module 2) |
| `orderService` create / cancel / deliver | **pooled (this module)** |
| `assignmentService.createAssignment` | **pooled (this module)** |
| `goldSchemeModel` ×3 | module 7 — the last ones |

Once module 7 lands, the temporary single `connection` in `db.cjs` can be deleted and
decision 2 is finally complete.

#### Write coverage extended

Reads cannot detect a broken transaction, so the sweep now runs a full order round trip:
create → verify the items actually committed → cancel (a second transaction with its own
rollback path).

```
POST /customer-orders (transaction)   PASS  order 1
  -> order items committed            PASS  1 item(s)
PATCH /customer-orders/:id/cancel     PASS  cancelled
```

**8 write checks now, up from 3.**

#### A test-data lesson, not a code bug

The first order attempt failed with `Data truncated for column 'order_type'`. The cause
was my test payload, not the code: `order_type` is
`enum('Ready Stock','Custom Jewellery','Repair')` and I had sent `"Custom"`. Worth noting
because a truncation error reads like corruption and is actually a rejected enum value —
the schema was defending itself correctly.

#### Cleanup

12 superseded `.cjs` files deleted. Bridge down to **22 `.cjs` files from 83** — 73%
converted.

**Sweeps**

```
read  : 47 routes, 44 OK, 3 known-broken, 0 regressions
write : 8/8 pass
database left clean
```

**Verdict: merged.**

---

### 7. Gold scheme — ✅ MERGED · 2026-08-13

**4 files** converted into `src/modules/schemes/`. `scheme.model.js` is the largest file
in the project at 25KB, holding the last three transaction sites in the codebase:
`createEnrollment`, `payInstallment` and `processSchemeMaturity`.

All three moved onto `withTransaction` from module 6 — the helper paid for itself
immediately, replacing three more copies of the same boilerplate with three one-line
changes.

#### Milestone: every transaction site is now pooled

| Site | Module |
|---|---|
| `createBill`, `updateBill` | 1 |
| `createAdvancePayment` | 2 |
| order create / cancel / deliver | 6 |
| `createAssignment` | 6 |
| `createEnrollment`, `payInstallment`, `processSchemeMaturity` | **7** |

**Ten sites, all on pooled connections.** The temporary single `connection` in `db.cjs`
now has only the remaining `.cjs` shadow files as consumers — once module 8 clears those,
it can be deleted and decision 2 (one shared pool) is finally complete.

#### Write coverage

Enrollment is the transaction that fans out across several tables, so it is the meaningful
one to exercise:

```
POST /gold-schemes/types                    PASS  type 1
POST /gold-schemes/enrollments (transaction) PASS  enrolled
```

**10 write checks now**, up from 3 when the write sweep was introduced.

#### Another test-data lesson

The scheme type first failed with `Data too long for column 'scheme_code'` — my payload
used a full 13-digit timestamp as the code. Same category as the `order_type` enum
failure in module 6: **the schema defending itself against bad test data, not a code
bug.** Both were fixed in the test, not the application.

Worth noting as a pattern — when a write sweep fails, check the payload against the column
definition before assuming the merge broke something.

#### Cleanup

4 superseded `.cjs` files deleted. Bridge down to **18 `.cjs` files from 83** — 78%
converted. Everything left belongs to the financial-security module or is a shadow waiting
on it.

**Sweeps**

```
read  : 47 routes, 44 OK, 3 known-broken, 0 regressions
write : 10/10 pass
database left clean
```

**Verdict: merged.**

---

### 8. Financial security — ✅ MERGED · 2026-08-13 · **PHASE A COMPLETE**

**6 files** converted into `src/modules/security/`, including the two PIN middlewares that
guard bill cancel and edit.

#### `S0-8` resolved — and the schema already knew better than the code

Unlike the cash book, most of this was a genuine rename: `financial_security` →
`financial_pin`, `security_id` → `pin_id`. But `updateSecuritySettings` also wrote
`max_discount_percent` and `max_rate_change_percent`, which do not belong on a PIN record —
a PIN row holds a hash; a discount ceiling is a business rule.

**The schema already had the right home.** `financial_settings` existed, unused, with
`max_discount_percent` already present alongside `default_gst_metal`,
`default_gst_making`, `default_making_charge` and `invoice_prefix`. The code simply did not
know about it.

So the settings writes were repointed there and migration `2026-08-13_04` added only the
one genuinely missing column, plus the singleton settings row the code's
`WHERE setting_id = 1` needs to have something to update. Its GST defaults (3% metal, 5%
making) deliberately match the values currently hardcoded in the billing calculator, so
`S1-9` can later read them from here instead.

That is the third time the merge has found the schema better designed than the code that
used it — after the ledger and the income/expense pair.

#### Verified end to end, not just by status code

```
GET   /financial-security/          200
POST  /set-pin                      201  PIN created
POST  /verify-pin  (correct PIN)    200  verified
POST  /verify-pin  (wrong PIN)      400  correctly rejected
PATCH /settings                     200  updated
```

Confirmed in the database afterwards: the PIN is stored as a 60-character bcrypt hash
(`$2b$10$…`, never plaintext), and the settings persisted exactly as sent (15 / 7).

**Rejecting the wrong PIN is the test that matters.** An endpoint that returns 200 for a
correct PIN proves nothing on its own — it has to say no to a bad one.

---

## PHASE A COMPLETE — the CommonJS bridge is gone

**All 83 bridged `.cjs` files are converted or deleted. Zero remain.**

| Removed at the end | Why it could go |
|---|---|
| 16 orphaned `.cjs` | A closed loop unreachable from `app.js` once security converted |
| `rateLimiter.cjs` | Converted to ESM |
| `db.cjs` | Its whole reason to exist was that CommonJS cannot `require()` ESM |
| the second DB connection | All ten transaction sites now use `withTransaction` |

`config/db.js` is now a single file with **one pool**, exposed through both a promise and a
callback API. **Decision 2 of the merge plan is complete.**

Also deleted: `customerModel.cjs` (Riya's), superseded by the decision to take Purvansh's
customer module in phase B; and four 0-byte files that had sat inside features marked
complete in the original status report — `financialPin`, `validate`, `gstCalculator`,
`invoiceGenerator`.

### Phase A final state

```
read  : 47 routes, 47 OK, 0 failing, 0 regressions
write : 10/10 pass
```

**Every endpoint in the sweep passes.** For comparison, the first measured baseline on
2026-08-13 was 8 working and 7 failing.

| | Start | Now |
|---|:--:|:--:|
| Endpoints answering | 8 | **47** |
| Known-broken endpoints | 7 | **0** |
| Write paths tested | 0 | **10** |
| `.cjs` bridge files | 83 | **0** |
| Express apps | 2 | 1 |
| DB connections | 3 | **1 pool** |

Backlog items closed along the way: `S0-7`, `S0-8`, `S2-11`, `S2-15`, `S2-16`, plus the two
billing transaction bugs and half of `S2-18`.

Still open and deliberately not touched: `S1-3` (route-level auth), the structural half of
`S2-18`, `S1-8` (GST-compliant invoice numbering), `S1-9` (GST rates from the table).

**Next: Phase B** — Purvansh's 100 stranded inventory files, which have never run.

---

## PHASE B — recovering the stranded inventory backend

Different character to phase A. That phase converted code that was already running, checked
against a known baseline. This phase mounts code from `developer-purvansh` that has
**never executed** — no baseline exists, so the first sweep is discovery, not
regression-checking.

No conversion needed: it is already ESM, already uses `ApiError`/`ApiResponse`, and its
`import { pool } from '../config/db.js'` matches what our consolidated `db.js` exports.
Only the import depth changes, since his layout was layer-first
(`controllers/`, `services/`) and ours is module-first (`modules/<name>/`).

---

### 9. Masters — ✅ MERGED · 2026-08-13

Categories, subcategories, designs, purity, metal types, stone types. **24 files**
into `src/modules/masters/`.

**It worked on the first run.** Every endpoint answered with real data from the existing
database, on code that had never been executed:

| Endpoint | Result |
|---|---|
| `GET /categories` | 200 · 8 rows |
| `GET /categories/1` | 200 |
| `GET /categories/1/subcategories` | 200 · 2 rows |
| `GET /subcategories/1` | 200 |
| `GET /designs` | 200 · 8 rows |
| `GET /purity` | 200 · 7 rows |
| `GET /metal-types` | 200 · 3 rows |
| `GET /stone-types` | 200 · 8 rows |

**Not a bug:** `GET /subcategories` returns 404, because that route deliberately has no
list handler — subcategories are listed under their parent at
`/categories/:id/subcategories`. Correct design, and worth recording so nobody "fixes" it.

**Write path checked too:**

```
POST /categories  {valid}   ->  201  category_id 9
POST /categories  {}        ->  400  "category_code and category_name are required"
```

That 400 is the point. It is a **typed** error with a specific message, produced by
validation in the service layer — the quality difference the earlier measurement found
between the two codebases. Nothing in phase A validates its input like this.

**Why this module went so smoothly:** it was chosen deliberately as the first phase-B
merge — six near-identical CRUD entities, depending on nothing and with nothing depending
on them. The merge plan called it "the safest place to learn the new structure before
touching anything that matters", and that held.

**Sweeps**

```
read  : 59 routes, 59 OK, 0 failing, 0 regressions
write : 10/10 pass
```

**Verdict: merged.**

---

### 10. Customers — ✅ MERGED · 2026-08-13

**20 files** into `src/modules/customers/`: customer CRUD, documents, notes, loyalty/VIP,
and analytics. Plus `config/multer.js` for file uploads and `multer` as a dependency —
pinned to **2.x**, not the `1.4.5-lts.1` his branch specified, which carries known
advisories.

**Deliberately excluded: `customerLedger`.** Riya's implementation was chosen (see the
duplicate table above) because it uses the real `customer_ledger` table, whereas this one
derived balances from `customer_orders` as a documented stopgap.

All **12 read endpoints answered on the first run**, including search, pagination,
documents, notes, loyalty history, VIP list, purchase history, LTV, and birthday /
anniversary tracking.

#### Bug 1 — `customer_code` could never be inserted

Creating a customer failed outright: `Field 'customer_code' doesn't have a default value`.

The service deliberately derives the code from the new row's id — `CUS000025` — which is a
good design: codes come out sequential and unique by construction, and a client cannot
invent its own. But it needs the column to tolerate being empty between the INSERT and the
UPDATE, and it was `NOT NULL` with no default.

**Suppliers use the identical pattern**, so migration `2026-08-13_05` relaxes both. Products
are unaffected — their code comes from the caller and is validated. The migration documents
a recovery query, since the code is always rebuildable from the id.

#### Bug 2 — a systemic one: omitted optional fields broke every insert

Uploading a document failed with `Bind parameters must not contain undefined`. The cause is
the dynamic query builder used throughout these repositories:

```js
const fields = Object.keys(data);
const values = Object.values(data);
```

If any property is `undefined` — which happens **whenever a caller omits an optional
field** — mysql2 rejects the entire statement. That is normal usage, not an edge case.

Found in **17 sites across 9 repositories**, and it would have fired on every module still
to be merged. Fixed by dropping undefined entries rather than coercing them to `NULL`:

- on **insert**, omitting the key lets the column's own `DEFAULT` apply
- on **update**, it means a partial update leaves omitted columns *untouched* instead of
  overwriting them with `NULL` — which is the more dangerous of the two

Worth noting what this cost: **the file was already written to disk when the insert
failed**, leaving an orphan upload with no database record. Fixing the insert removed the
symptom, but the ordering (write file, then insert) is still not atomic.

#### Three "bugs" that were not bugs

Each of these looked like a defect and turned out to be the system defending itself:

| Symptom | Reality |
|---|---|
| Upload rejected with `Unexpected field` | multer correctly refusing a field name it was not configured for — my payload said `document`, the route expects `document_file` |
| `Data truncated for column 'document_type'` | `document_type` is `enum('Aadhaar','PAN','Passport','Driving Licence','GST Certificate','Other')`. `"KYC"` is not a member |
| Reactivating after delete returned 404 | `DELETE` is a genuine hard delete, and the customer really was gone |

That last one deserves attention, because the schema is doing something clever. Foreign
keys to `customers` split into two groups:

```
CASCADE    customer_documents, customer_loyalty, customer_notes   (the customer's own records)
NO ACTION  bills, payments, customer_orders, customer_ledger,
           cash_ledger, gold_scheme_enrollments                    (financial history)
```

So a customer created by mistake can be removed along with their notes and documents, but
**a customer with any financial history cannot be deleted at all** — the delete fails and
the service converts it into a clear 400. That is exactly right for an accounting system,
and it is the fourth time this schema has proven better designed than the code using it.

**Write path fully verified**, including a real multipart upload:

```
POST   /customers                      201  id 25, code CUS000025
POST   /customers  duplicate mobile    409  correctly refused
POST   /customers  empty body          400  correctly rejected
POST   /customers/:id/notes            201
POST   /customers/:id/loyalty/earn     200
POST   /customers/:id/loyalty/redeem   200
POST   loyalty/redeem beyond balance   400  correctly refused
PATCH  /customers/:id/vip              200
PUT    /customers/:id                  200
POST   /customers/:id/documents        201  file on disk + DB row
GET    /customers/:id/documents        200  1 document
PATCH  /customers/:id/activate         200
DELETE /customers/:id                  200
GET    deleted customer                404  as expected
```

**Sweeps**

```
read  : 59 routes, 59 OK, 0 regressions
write : 10/10 pass
```

**Verdict: merged.**

---

### 11. Suppliers — ✅ MERGED · 2026-08-13

**8 files** into `src/modules/suppliers/`: supplier CRUD and supplier documents.

**`supplierLedger` excluded** — Riya's covers all six ledger types and stays at
`/ledger/supplier`.

#### Supplier payments deferred — a real dependency, not a preference

The merge plan grouped supplier payments under suppliers. Mounting it failed:

```
Cannot find module '.../suppliers/purchaseOrder.repository.js'
imported from .../suppliers/supplierPayment.service.js
```

A supplier payment is made **against a purchase order**, so its service imports
`PurchaseOrderRepository`. It belongs with the purchase module, not this one. Deferred
rather than forced — dragging `purchaseOrder.repository.js` in early would have split the
purchase module across two merges for no benefit.

This is the dependency ordering the merge plan was meant to enforce, correcting itself
against reality. Worth noting that the plan's *grouping* was wrong while its *principle*
was right.

#### Both earlier fixes paid off immediately

`SUP000006` was derived correctly on the first create — migration `_05` had already made
`supplier_code` nullable for exactly this pattern. And the repository builders were fixed
for `undefined` values before they were ever run here.

Two bugs found in customers that never had to be found again.

#### One new bug — another parallel-table asymmetry

`GET /suppliers/:id/documents` failed with `Unknown column 'status' in 'where clause'`.

`customer_documents` and `supplier_documents` are the same kind of record, and the code
treats them identically — both list only active documents and soft-delete by setting
`status`. The schema gave the column to only one:

```
customer_documents  ... document_file, remarks, status, created_at ...
supplier_documents  ... document_file, remarks,         created_at ...
```

Exactly the shape of the income/expenses split in migration `_03`. Migration
`2026-08-13_06` adds the column rather than stripping the soft-delete from the supplier
side — which would have meant deleting real KYC documents outright instead of hiding them.

**Write path verified**

```
POST   /suppliers                    201  id 6, code SUP000006
POST   /suppliers duplicate mobile   409  correctly refused
PUT    /suppliers/:id                200
POST   /suppliers/:id/documents      201  file + DB row
GET    /suppliers/:id/documents      200  1 document
DELETE /suppliers/:id                200
```

**Sweeps**

```
read  : 72 routes, 72 OK, 0 regressions
write : 10/10 pass
```

**Verdict: merged.**

---

### 12. Products — ✅ MERGED · 2026-08-13

**8 files** into `src/modules/products/`: products, variants, barcodes and images.

#### First real cross-module dependency — and it works

`product.service.js` validates a new product against the master lists before creating it,
importing three repositories that now live in a different module:

```js
import CategoryRepository  from '../masters/category.repository.js';
import MetalTypeRepository from '../masters/metalType.repository.js';
import PurityRepository    from '../masters/purity.repository.js';
```

The path-rewriting script would have pointed these at `./`, since in his layer-first
layout they were siblings. Caught by checking every local import resolves to a file that
exists — a check now worth running on every extraction.

**Verified live:** creating a product with `category_id: 99999` returns **404**, not a
foreign-key 500. The service checks the master list first and produces a proper error.
That is masters and products genuinely integrated, not just co-mounted.

All 7 read endpoints answered on the first run.

#### Not a bug — the schema separates SKU from measurements

`POST /products` first failed with `Unknown column 'gross_weight'`. That was my payload:

```
products          product_id, product_code, product_name, category_id,
                  subcategory_id, design_id, metal_type_id, purity_id,
                  stone_type_id, hsn_code, description, is_customizable, is_active

product_variants  variant_id, product_id, variant_code, size, gross_weight,
                  net_weight, stone_weight, making_charge_type,
                  making_charge_value, wastage_percentage, status
```

A product is the **design**; a variant is the **physical item** with weights and making
charges. Correct modelling for jewellery — one ring design exists in several sizes and
weights — and another instance of the schema being right.

#### Third upload path verified

`POST /products/:id/images` writes to `uploads/products/product_<id>/`. The field is
`image_file` (customers use `document_file`, suppliers likewise) — worth noting, since
each route configures multer with its own field name and a mismatch returns a confusing
`Unexpected field` 500.

**Write path verified**

```
POST   /products                      201  id 16
POST   duplicate product_code         409  correctly refused
POST   with nonexistent category      404  correctly refused (cross-module check)
POST   empty body                     400  correctly rejected
POST   /products/:id/variants         201  variant created
GET    /products/:id/variants         200  1 variant
PUT    /products/:id                  200
POST   /products/:id/images           201  file on disk + DB row
GET    /products/:id/images           200  1 image
DELETE /products/:id                  200
```

**Sweeps**

```
read  : 77 routes, 77 OK, 0 regressions
write : 10/10 pass
```

**Verdict: merged.**

---

### 13. Inventory — ✅ MERGED · 2026-08-13

**8 files** into `src/modules/inventory/`: stock operations and 11 analytics endpoints.

**This is the module the original status report listed as ⏳ Pending.** All 14 endpoints
answered on the first run, and the stock operations work correctly with full validation.
It was finished; it had simply never been mounted.

| Reported | Actual |
|---|---|
| Inventory UI 🔄, Product/Stock Management 🔄 | backend complete |
| Stock In/Out ⏳ Pending | working, with validation |
| Stock Adjustment ⏳ Pending | working |
| Gold/Silver Stock Tracking ⏳ Pending | working, plus platinum, diamond and stones |
| Inventory Analytics 🔄 In Development | 11 endpoints, all answering |

#### Stock operations verified against the database, not just by status code

```
GET  /inventory?product_id=1              available_quantity 25
POST /inventory/in      (+5, Purchase)    200
POST /inventory/out     (-5, Sale)        200
POST /inventory/adjust  (+2, Adjustment)  200
                                          -> available_quantity 27
```

And the `stock_movements` ledger recorded each one with the correct sign:

```
Purchase    +5
Sale        -5
Adjustment  +2
```

Restored to 25 afterwards and the test movements removed.

#### The validation is genuinely good

```
POST /inventory/out beyond available stock   400  correctly refused
POST /inventory/in  nonexistent product      404  correctly refused
POST with an invalid movement_type           400  correctly refused
```

**Refusing to oversell matters most.** Allowing stock to go negative in a jewellery shop
means selling an item that is not there. The service checks available quantity before
applying an OUT movement, and `movement_type` is validated against a fixed list rather
than passed straight to the database.

Second cross-module dependency, also working: `inventory.service.js` imports
`ProductRepository` from products and returns a clean 404 for a product that does not
exist, rather than a foreign-key error.

**Sweeps**

```
read  : 87 routes, 87 OK, 0 regressions
write : 10/10 pass
```

**Verdict: merged.**

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
