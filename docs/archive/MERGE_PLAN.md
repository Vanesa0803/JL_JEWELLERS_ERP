# Merge Plan — module by module

> **Status update — 2026-08-13.** This plan was originally written for the student team
> to execute. That changed: the consolidation is now being done directly, with the
> students moving to feature work afterwards. The plan itself still holds — the four
> decisions and the module order are unchanged — but the ownership table in §7 is no
> longer how the work is being split.
>
> **The four decisions are now settled.** See "Decisions — SETTLED" below.
>
> **Working rule for this phase:** we are merging code that already exists. Small patch
> and glue code to make modules fit together is in scope. Writing missing features is
> not — anything that would need to be authored from scratch (e.g. the salary module)
> is deferred, not merged.
>
> Live progress is recorded in **[MERGE_LOG.md](MERGE_LOG.md)**, one entry per module,
> with the endpoint results that prove it works.

**The question:** four developers, six branches, how do we merge them?

**The short answer:** don't merge *branches*. Merge *modules*, one at a time, into
one agreed folder structure — and make four decisions before you start.

---

## Why a normal `git merge` will not work

Two developers put completely different code in **the same folder**:

| Branch | Lives at | Style | Files |
|---|---|---|---|
| `developer-riya` (finance) | `backend/src/` | CommonJS (`require`) | ~80 |
| `developer-purvansh` (inventory) | `backend/src/` | ESM (`import`) | ~110 |

Running `git merge developer-purvansh` collides head-on:

| File | The clash |
|---|---|
| `backend/src/app.js` | Both create the Express app, with different routes and different syntax |
| `backend/src/config/db.js` | One exports a callback connection, the other a promise pool |
| `backend/package.json` | One needs `"type": "commonjs"`, the other needs ESM |

And even the files that *don't* collide by name still can't run together — you cannot
mix `require` and `import` files in one package without converting them.

So the merge is not a git problem. **It's a restructuring problem.** Git will happily
combine the text; the result just won't run.

---

## The good news

**The frontend needs no merge at all.** We checked:

- `billing-integration` frontend already contains everything in `frontend-vanshika`
- It also contains everything in `auth-integration`, plus 23 more files
  (orders, payments, suppliers pages and a fuller router)

So `billing-integration` is the newest frontend and it supersedes the others.
That's why `rebuild/foundation` was branched from it. **One less merge to worry about.**

---

## Decisions — SETTLED 2026-08-13

All four are now decided. They were confirmed by measuring both codebases rather than by
preference. Recorded here so nobody reopens them mid-merge.

| # | Decision | Settled as | Why |
|:--:|---|---|---|
| 1 | Module system | **ESM** (`import`) | Quality measurement, below. Riya's 81 files get converted |
| 2 | Database client | **One shared `mysql2` pool** | `createPool()` exposes a callback API *and* a promise API via `.promise()`, so both coding styles run off one pool without rewriting either |
| 3 | Response shape | **`ApiResponse` / `ApiError`** | Already written, pairs with a working error handler |
| 4 | URL prefix | **`/api/v1/...`** | Purvansh's 100 files already use it. Frontend cost is one line in each of two axios files |

### The measurement behind decision 1

An earlier draft of this plan recommended ESM. That was then argued against on risk
grounds — converting working code is more dangerous than converting code that has never
run. Measuring both codebases settled it back in favour of ESM:

| | Riya (finance) | Purvansh (inventory) |
|---|:--:|:--:|
| Files | 81 | 100 |
| **Empty files** | **7** | **0** |
| Still on callbacks | 17 | 2 |
| async/await | 35 | **70** |
| Error style | bare `new Error()` | `ApiError(404, …)` with status codes |
| Error middleware | empty file | working, with dev/prod stack handling |

Purvansh's architecture is the better target: it validates inputs, checks foreign keys
before inserting, and throws errors that carry real HTTP status codes.

**What made converting the working code safe:** we now have a measured baseline of 15
endpoints with known results. The risk in rewriting working code is failing to notice
when you break it — and that is now detectable within minutes of every change.

---

## Four decisions to make before writing any code

Do not start merging until the team has agreed all four. Every module merge depends
on them, and changing your mind halfway means redoing the work.

### Decision 1 — `import` or `require`?

You must pick one. Mixed is not an option.

| | Files to convert | |
|---|:--:|---|
| Go **ESM** (`import`) | ~80 (Riya's finance) | ✅ **Recommended** |
| Go **CommonJS** (`require`) | ~110 (Purvansh's inventory) | more work |

**Recommended: ESM.** Fewer files to convert, it's the modern standard, and it's what
the frontend already uses — so students aren't switching mentally between two styles.

The conversion is mechanical and is a genuinely good learning task:
`const x = require("y")` → `import x from "y.js"` (note: ESM needs the `.js` on the end),
and `module.exports = { a, b }` → `export { a, b }`.

### Decision 2 — how do we talk to MySQL?

| Version | Where | Verdict |
|---|---|---|
| `mysql.createConnection()`, callbacks | Riya's finance | ❌ Single connection. Will fall over the moment two people use the app at once |
| `mysql.createPool()`, promises | Purvansh's inventory | ✅ **Keep this one** |
| `mysql.createPool()`, promises | old auth backend | ✅ Same idea, fine |

**Recommended: Purvansh's promise pool.** This means Riya's models need rewriting from
callbacks to `async/await`. That's real work — budget for it — but a single connection
in a multi-user shop app is a bug waiting to happen.

### Decision 3 — what shape do API responses have?

Right now there are three:

```js
{ success: true, data: {...} }      // finance
new ApiResponse(200, data, "msg")   // inventory
[ {...}, {...} ]                    // HR — just a bare array
```

**Recommended: Purvansh's `ApiResponse` / `ApiError` classes.** They're already written,
they pair with a working error handler, and they give every endpoint the same shape.
The frontend cannot be built sensibly until this is settled.

### Decision 4 — what do URLs look like?

`/api/v1/customers` (inventory) vs `/api/customers` (finance and HR).

**Recommended: `/api/v1/...` everywhere.** Costs nothing now, saves pain later.

> Write these four decisions down somewhere the whole team can see. Most merge
> arguments are really disagreements about one of these four.

---

## The target structure

Instead of one flat `src/` where everyone's files pile up, group by business module.
Each module owns its own routes, controller, service and data access:

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/          route · controller · service
│   │   ├── masters/       categories, purity, metal types, stone types, designs
│   │   ├── customers/
│   │   ├── suppliers/
│   │   ├── products/
│   │   ├── inventory/
│   │   ├── purchase/      purchase orders, GRN, returns, supplier payments
│   │   ├── billing/
│   │   ├── payments/
│   │   ├── ledger/
│   │   ├── finance/       income, expenses, cash book, P&L
│   │   ├── orders/        customer orders, makers, assignments
│   │   ├── schemes/       gold scheme
│   │   ├── reports/       reports, exports, analytics
│   │   ├── security/      financial PIN
│   │   └── hr/            employees, attendance, salary
│   ├── config/            db.js  (ONE connection pool)
│   ├── middleware/        auth · errorHandler · validate · rateLimiter
│   ├── utils/             ApiError · ApiResponse · asyncHandler
│   └── app.js             ONE app, mounts every module
└── server.js
```

**Why this shape:** one student can own one folder and not collide with anyone else.
That is the actual fix for how this project got into trouble — four people editing
the same flat folders on separate branches for weeks.

---

## Merge order

Ordered by **dependency**, not by importance. Each module can only merge once the
things it references already exist.

Base branch: `rebuild/foundation` — already contains the finance backend, the newest
frontend, and a working single-server setup.

### Stage 0 — Shared foundation *(nobody merges anything until this is done)*

| Step | What | From | Effort |
|:--:|---|---|:--:|
| 0.1 | Create the `modules/` folder structure, empty | — | XS |
| 0.2 | One `config/db.js` — the promise pool | `developer-purvansh` | XS |
| 0.3 | `utils/ApiError.js`, `ApiResponse.js`, `asyncHandler.js` | `developer-purvansh` | XS |
| 0.4 | A real `middleware/errorHandler.js` | `developer-purvansh` | XS |
| 0.5 | Write `middleware/auth.js` — it is currently an **empty file** | write new | S |
| 0.6 | Rewrite `app.js` to mount modules under `/api/v1` | write new | S |

**Everything downstream depends on this.** Assign it to one person, review it as a
team, merge it before anyone else starts.

### Stage 1 — Foundations *(safe, no dependencies — good first tasks)*

| # | Module | From | Depends on | Conflict? | Effort |
|:--:|---|---|---|---|:--:|
| 1 | **auth** | `auth-integration` (fuller: adds profile, logout, reset-password, change-password) | Stage 0 | Replaces the basic version already on the base branch | S |
| 2 | **masters** — categories, subcategories, purity, metal types, stone types, designs | `developer-purvansh` | Stage 0 | None | M |

> **Start with masters.** Six near-identical CRUD modules, nothing depends on them,
> nothing they depend on. It's the perfect module for a student to learn the new
> structure on before touching anything that matters.

### Stage 2 — The parties

| # | Module | From | Depends on | Conflict? | Effort |
|:--:|---|---|---|---|:--:|
| 3 | **customers** | `developer-purvansh` | Stage 0 | ⚠️ **Duplicate** — see below | M |
| 4 | **suppliers** | `developer-purvansh` | Stage 0 | None | M |

⚠️ **Duplicate to resolve:** customers is implemented **twice** — Riya has
`models/customerModel.js`, Purvansh has `repositories/customer.repository.js`.

**Keep Purvansh's.** It has documents, notes, loyalty, VIP, analytics and ledger
behind it; Riya's is a thin helper used by billing. Delete Riya's and repoint billing
at the new one.

### Stage 3 — Stock

| # | Module | From | Depends on | Conflict? | Effort |
|:--:|---|---|---|---|:--:|
| 5 | **products** — products, variants, barcodes, images | `developer-purvansh` | masters | None | M |
| 6 | **inventory** — stock in/out/adjust, movements, analytics | `developer-purvansh` | products | None | M |
| 7 | **purchase** — POs, GRN, returns, supplier payments | `developer-purvansh` | suppliers, products | None | L |

> This whole stage is currently on **no** integration branch. It is roughly 85% built
> and completely invisible to the running app. Getting it merged is the single biggest
> unlock in the project.

### Stage 4 — Money in

| # | Module | From | Depends on | Conflict? | Effort |
|:--:|---|---|---|---|:--:|
| 8 | **billing** | base branch (Riya) | customers, products | Convert to ESM + promise pool | L |
| 9 | **payments** | base branch (Riya) | billing | Same conversion | L |

### Stage 5 — The books

| # | Module | From | Depends on | Conflict? | Effort |
|:--:|---|---|---|---|:--:|
| 10 | **ledger** | ⚠️ both | customers, suppliers, billing | ⚠️ **Duplicate** — see below | M |
| 11 | **finance** — income, expenses, cash book | base branch (Riya) | ledger | Fix `cash_book` → `cash_ledger` while you're in here | M |

⚠️ **Duplicate to resolve:** customer ledger and supplier ledger both exist on Riya's
and Purvansh's branches.

**Keep Riya's.** Hers covers all six ledger types (customer, supplier, cash, bank,
daily, expense); Purvansh's covers only the two party ledgers, as a side-feature of
the customer module.

*(Note this goes the opposite way to the customers decision — pick per module based on
which one is actually more complete, not per developer.)*

### Stage 6 — The rest of the business

| # | Module | From | Depends on | Conflict? | Effort |
|:--:|---|---|---|---|:--:|
| 12 | **orders** — customer orders, makers, assignments | base branch (Riya) | customers, products | Conversion only | M |
| 13 | **schemes** — gold scheme | base branch (Riya) | customers, payments | Conversion only | M |
| 14 | **security** — financial PIN | base branch (Riya) | billing | Fix `financial_security` → `financial_pin` | S |
| 15 | **reports** — reports, exports, analytics | base branch (Riya) | almost everything | Merge the two duplicate export routes | L |

> Modules 12, 13 and 15 include work that **was never mentioned in the status report** —
> customer orders, makers, gold scheme, and eight business-intelligence endpoints.
> All are largely built. Make sure whoever wrote them gets credit.

### Stage 7 — HR *(last: lowest quality, fewest dependencies)*

| # | Module | From | Depends on | Conflict? | Effort |
|:--:|---|---|---|---|:--:|
| 16 | **hr** — employees, departments, attendance, salary | `auth-integration` | auth | Needs real fixes, not just a move | L |

Merge this last because it needs the most repair: the attendance code queries a table
that doesn't exist, employees uses a column that doesn't exist, and all four salary
endpoints return fake hardcoded success messages. Moving it is easy; making it work is
a project of its own.

---

## Suggested ownership

Keep each person near what they wrote — they'll spot mistakes nobody else would.

| Person | Modules | Roughly |
|---|---|---|
| **Purvansh** | Stage 0 foundation, masters, customers, suppliers, products, inventory, purchase | 7 modules |
| **Riya** | billing, payments, ledger, finance, orders, schemes, security, reports | 8 modules |
| **Aditya** | auth, hr | 2 modules + the most repair work |
| **Vanshika** | Frontend — nothing to merge; start wiring screens to the API as each module lands | ongoing |

**Vanshika is unblocked immediately.** As each backend module is merged and confirmed
working, the matching screen can be connected. She shouldn't be waiting for the whole
merge to finish. Suggested order: billing → payments → customers → dashboard.

---

## Rules for each merge

Same steps every time, so it stays predictable:

1. Branch from the current integration branch: `merge/<module-name>`
2. Move the files into `src/modules/<module>/`
3. Convert to the four agreed decisions (ESM, pool, ApiResponse, `/api/v1`)
4. Mount it in `app.js`
5. **Call every endpoint once and write down the result.** Not "it compiles" — an
   actual request with an actual response
6. Open a PR listing which endpoints returned 200 and which didn't
7. Merge only when someone else has reviewed it

**Step 5 is the one that matters.** The reason the project drifted so far from its
status report is that "done" meant "the file exists". A module is merged when its
endpoints answer correctly — not when the code is in the folder.

---

## What to expect

| Stage | Modules | Rough effort |
|---|:--:|:--:|
| 0 — Foundation | — | 2–3 days |
| 1 — Auth + masters | 2 | 3–4 days |
| 2 — Parties | 2 | 4–5 days |
| 3 — Stock | 3 | 1.5 weeks |
| 4 — Money in | 2 | 1.5 weeks |
| 5 — The books | 2 | 1 week |
| 6 — The rest | 4 | 1.5 weeks |
| 7 — HR | 1 | 1 week |
| | | **~7 weeks** |

That's for the backend merge alone, with the team working in parallel. Frontend wiring
runs alongside it from Stage 4 onwards.

---

## Two things to avoid

**Don't try to merge everything at once.** A single big-bang merge of six branches
with two module systems will produce hundreds of conflicts and nobody will be able to
tell working code from broken code afterwards.

**Don't merge into `main` yet.** Leave `main` exactly as it is until the integration
branch runs properly end to end. It's your rollback. Replace it once — at the end —
when there's something demonstrably better to replace it with.
