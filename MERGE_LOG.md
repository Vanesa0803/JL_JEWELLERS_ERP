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
| 1 | billing | Riya | ⏳ | ⏳ | ⏳ | not started |
| 2 | payments | Riya | ⏳ | ⏳ | ⏳ | not started |
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
