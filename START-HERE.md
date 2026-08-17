# JL Jewellers ERP — Where The Project Stands

Read this first. It answers four questions:

1. What was wrong, and how it was fixed
2. What each branch had, and how it was merged
3. What works today
4. What is missing — your work

Everything below is measured, not estimated. Commands to verify it yourself are at
the end.

---

## Running it

```bash
npm run db:install    # once per machine. Needs administrator rights.
npm run bootstrap     # everything else. Safe to re-run.
npm run dev           # every day after that
```

Open **http://localhost:5173** · sign in with `admin@jljewellers.com` / `Admin@123`

You should not need to edit any file by hand. If a step fails, read what it printed —
it names the actual cause.

---

## 1. What was wrong, and how it was fixed

The reports were all "the frontend can't reach the backend." That was never one
problem. Here is what it actually was.

### The blockers

| # | The problem | Why it mattered | Fixed by |
|:--:|---|---|---|
| 1 | **Two Express apps on two ports.** Auth ran on 5005, finance on 5000, and the finance app had no `/api/auth` at all | No single server served the whole API | One app on port 5000 — 41 route files, 92 endpoints |
| 2 | **The frontend called the wrong port** — hardcoded 5005 | Every request went nowhere | Frontend calls `/api`; Vite forwards it. **CORS is no longer involved at all** |
| 3 | **JWT signed with the literal string `"secret"`**, verified against `process.env.JWT_SECRET` | Every token the app issued was rejected by its own middleware. Always | Signs with `process.env.JWT_SECRET` |
| 4 | **The token payload read `user.id`** — the primary key is `user_id` | Every token identified nobody | Payload carries `user_id` |
| 5 | **`bcryptjs` was imported but not in `package.json`** | Auth server would not start on a clean install | Added |
| 6 | **Seeded passwords were plaintext** (`admin123`) | Login compares with bcrypt, which can never match plaintext. **The credentials printed in every document did not work** | Real bcrypt hashes |
| 7 | **Route guards were empty files** | Every route was open | Auth mounted on all 41 route files |
| 8 | **`<Toaster />` was never mounted** — dead code in `main.jsx` | Every error message in the app was silently discarded | Mounted |
| 9 | **Two schema files had unresolved merge conflicts** committed in them | `<<<<<<<` is not valid SQL, so those files had **never been loadable** | Resolved against the live database |
| 10 | **No file created the database**, and the SQL had to be run in an exact undocumented order | Wrong order half-loads the schema — looks fine, breaks later | `npm run bootstrap` |
| 11 | **MySQL install left no data directory**, and nothing could create one | Dead end on any machine without MySQL already set up | Bootstrap initialises it |

### The pattern behind almost all of them

**The code had never been run.** Not "run and buggy" — never executed once.

Point 3 is the clearest case. Login *looked* like it worked: it returned a token,
the frontend stored it, the page redirected. Nothing failed until something spent
the token, and nothing did yet. Point 6 is the same shape: every document printed
credentials that could not work.

> **The habit that prevents all of it:** a feature is done when you have called it
> and seen the response. Not when the file exists.

---

## 2. What each branch had, and how it was merged

Four developers, six branches. **We did not `git merge` them.**

### Why not

The branches disagreed on four fundamental things — folder layout, module system,
database client, and URL prefix. A `git merge` would have produced a codebase where
half the files used `require` and half used `import`, against two different database
connections. That does not resolve; it just breaks in a new place.

So: **merge modules, one at a time, into one agreed structure** — after settling the
four decisions up front.

### The four decisions

| Decision | Settled as | Why |
|---|---|---|
| Module system | **ESM** (`import`) | Measured both codebases — see below |
| Database client | **One shared `mysql2` pool** | `createPool()` exposes both a callback and a promise API, so both coding styles work off one pool without rewriting either |
| Response shape | **`ApiResponse` / `ApiError`** | Already written, and pairs with a working error handler |
| URL prefix | **`/api/v1/...`** | 100 files already used it. Cost on the frontend was one line in two files |

The module-system decision was argued both ways, then settled by counting:

| | Finance branch | Inventory branch |
|---|:--:|:--:|
| Files | 81 | 100 |
| **Empty files** | **7** | **0** |
| Still on callbacks | 17 | 2 |
| `async/await` | 35 | **70** |
| Error handling | bare `new Error()` | `ApiError(404, …)` with status codes |
| Error middleware | **empty file** | working |

Measurement beat preference. That is the point.

### What each branch actually held

| Branch | What was in it | Outcome |
|---|---|---|
| `developer-purvansh` | **All 100 inventory files** — customers, suppliers, products, inventory, purchase | **The big find.** In no integration branch. Recovered whole |
| `auth-integration` | Fuller auth + HR — 6 endpoints including profile, logout, password change | **Best auth controller.** Taken |
| `billing-integration` | Billing, payments, the running server | Base for the merge |
| `developer-riya` | Finance backend | **Nothing unique** — byte-identical to `billing-integration` |
| `developer-aditya` | One differing file: `authController.js` | **Worse.** See the trap below |
| `frontend-vanshika` | Dashboard UI | Superseded — 23 files behind |
| `main` | — | Strictly behind. Frontend was an empty scaffold. Discarded |

### A trap worth remembering

`developer-aditya`'s auth controller had **6 endpoints** against the 2 then running.
It looked like the obvious winner.

It queried `SELECT id FROM users`. **That column does not exist** — the key is
`user_id`. Four of its six endpoints would have failed at runtime.

> **"More endpoints" and "better" are not the same thing.** Only checking against
> the real schema tells them apart.

### How modules were chosen

Not by branch, and not by author. Each module went to whichever branch had the best
implementation, judged on correctness against the live schema first, then error
handling and structure.

That cut both ways on purpose — `customers` came from the inventory branch, the
`ledger` modules from the finance branch. Two adjacent modules can come from
different developers. **Author was never a tiebreaker.**

**16 modules merged**, in dependency order, in three phases: finance and billing
first, then the recovered inventory backend, then auth and HR.

---

## 3. What works today

Measured, not claimed.

| | Count |
|---|:--:|
| API endpoints answering | **92** |
| Route files | **41** |
| Database tables and views | **95** |
| Screens that render | **19** |
| Modules merged | **16 of 16** |

Sample data loads: 8 users, 20 customers, 15 products, 15 bills.

### The 19 screens that exist

| Area | Screens |
|---|---|
| Auth | Login |
| Dashboard | Dashboard *(on real data)* |
| Billing | Billing, CreateBill, AllBills, DraftBills, CompletedBills, CancelledBills, InvoiceHistory |
| Customers | Customers, CustomerDetails, EditCustomer |
| Orders | Orders, CreateOrder, UpdateOrder, Delivery, CancelOrder |
| Payments | Payments |
| Suppliers | Suppliers |

Login works end to end. Invoices get proper GST serial numbers
(`INV/2026-27/0016`). Receiving goods updates stock, and deleting the receipt
reverses it.

---

## 4. What is missing — your work

### Eight modules have a working backend and no screen

This is the actual remaining work, and it is the best part of the project to be
handed.

| Module | Endpoints ready | Screen |
|---|:--:|---|
| Inventory | 14 | **none** |
| Business intelligence | 8 | **none** |
| Reports | 6 + exports | **none** |
| Ledgers | 6 | **none** |
| Makers / Karigars | ~10 | **none** |
| Gold schemes | ~12 | **none** |
| Finance | several | **none** |
| Notifications, Settings | — | **none** |

The hard question — *does the server do this correctly?* — is already answered. You
get to concentrate on the part that is genuinely yours: what the screen should show,
what the shopkeeper needs to see first, and what happens when there is no data yet.

**Pick one module and take it end to end.** Do not start several.

### Known open items

31 open, from a tracked total of 68 found / 37 closed.

| Level | Open | What it is |
|:--:|:--:|---|
| S0 — Blocker | **1** | `cash_book` vs `cash_ledger` — needs a decision, not a rename |
| S1 — Critical | **4** | Two are credential rotation, which only the repo owner can do |
| S2 — High | **10** | Features that run but produce wrong output |
| S3 — Medium | **3** | Architectural debt |
| S4 — Low | **13** | **Almost entirely the missing screens above** |

The S4 items are roughly 70% of all remaining effort. That is product design, not
integration.

Full detail with IDs, evidence and effort: **[REMEDIATION_BACKLOG.md](REMEDIATION_BACKLOG.md)**.
Use the IDs (`S2-15`) in commit messages.

### The one real blocker, explained

`S0-7` looks like a table rename and is not. The code writes seven columns
(`transaction_type, source, reference_id, customer_id, amount, remarks, created_by`)
to a table that has six different ones. **Only `transaction_type` and `amount`
overlap.** A find-and-replace fails immediately.

It affects the dashboard summary, cash book, cash flow, balance sheet and cash
advances. Three options are written up in the backlog. **Pick one deliberately.**

---

## Before you say something works

```bash
node scripts/sweep.cjs                 # 92 read endpoints
node scripts/sweep-writes.cjs          # 10 write paths, real transactions
cd frontend && npm run check:render    # every screen renders
```

The third one exists because of a mistake worth learning from. Both server sweeps
were passing green while **two screens were completely blank.** The faults were in
the pages, and no amount of API testing could see them.

**If you only test the API, you will make the same mistake.**

---

## Where else to look

| Doc | What it is |
|---|---|
| **[REMEDIATION_BACKLOG.md](REMEDIATION_BACKLOG.md)** | Every open item, with IDs. **Your work list** |
| [INTEGRATION_BRIEFING.md](INTEGRATION_BRIEFING.md) | Longer version of this document, with more reasoning |
| [CHANGES.md](CHANGES.md) | Every fix in plain language: what was wrong → what we did → what it taught |
| `docs/archive/` | The merge plan and merge log. History — you do not need them to work |

---

## One closing note

The database schema in this project is genuinely good — 95 tables and views covering
billing, GST, gold savings schemes, maker assignments, purchase orders, ledgers,
barcodes and audit logs. That was real design work and it held up under scrutiny.

The gap was never the design. It was that **the code was never run against it.** Most
of the 11 blockers above would have been caught in the first minute of actually
calling an endpoint.

That is the whole lesson. The rest is just work.
