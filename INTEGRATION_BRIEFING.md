# JL Jewellers ERP — Integration Briefing

**To:** the development team
**About:** why the frontend and backend would not connect, and how to merge from here

You asked for help identifying what was blocking the integration. We went through every
branch, ran the code, and checked it against the live database. Here is everything we
found and what to do next.

Read this whole thing before you write any more code. Some of it will change how you
plan the next few weeks.

---

## 1. The short answer: it was never CORS

You changed the CORS settings and the problem stayed. That is because CORS was never
involved. Here is what was actually happening.

**Your `backend` folder contains two completely separate Express applications.**

| File | What it serves | Port |
|---|---|---|
| `backend/app.js` | `/api/auth`, `/api/employees` | 5005 |
| `backend/src/app.js` | `/api/bills`, `/api/payments`, `/api/dashboard`, +13 more | 5000 |

Only one of them can run at a time. So:

- Start the billing server → **login does not exist**
- Start the login server → **billing does not exist**

Whichever one was running, half the API was missing. On top of that, the frontend was
hardcoded to call port **5005**, while `npm run dev` in the backend starts port **5000** —
so most requests were hitting a port with nothing behind it and failing with "connection
refused".

The browser reports a failed request in a way that often *mentions* CORS. That is what
sent everyone down the wrong path. **A connection-refused error and a CORS error look
similar in the console but have nothing to do with each other.**

There was a third problem underneath: `authController.js` requires `bcryptjs`, but
`package.json` lists `bcrypt` — a different package with a similar name. So even when
you did start the login server by hand, it crashed on startup before serving anything.

**None of this was visible from reading the code.** You had to try to run the whole thing
at once to see it. That is the theme of this document.

---

## 2. What you have actually built — this part is genuinely good

Before the harder feedback, this needs saying plainly, because it is true and it is not
small.

**The database schema is the strongest part of the project.** 87 tables covering metal
types, purity, product variants, barcodes, GRN and purchase orders, maker assignments and
work logs, gold scheme enrolments and installments, four kinds of ledger, financial PIN
with attempt logging, GST rates, invoice sequences, audit trails. It is a properly
modelled jewellery retail system. We verified it against the running database: the SQL
files match the live database exactly, 87 tables on both sides. Anyone can rebuild a
working environment from your `database/` folder. That is worth a lot.

**Several modules are more complete than your report claimed.** This surprised us:

| Module | You reported | Actually |
|---|---|---|
| Business Intelligence | **0% / not started** | 8 of the 9 listed features are built and **return real data** |
| Financial Security PIN | **0% / not started** | 6 endpoints, bcrypt-hashed PINs, already wired into bill cancel and edit |
| Inventory backend | **Pending** | 23 route modules — products, variants, GRN, purchase orders, stock in/out/adjust, 11 analytics endpoints |
| Supplier backend | **In development** | Full CRUD, documents, ledger, payments |
| Customer orders + Makers | *not mentioned at all* | Fully built — orders, delivery, maker assignments, productivity |
| Gold Scheme | *barely mentioned* | 13 endpoints. `goldSchemeModel.js` is the largest file in the project |

Someone built a lot of work that nobody got credit for. Payments is 16KB of solid,
well-structured code. The billing engine's transactional bill creation is correct. The
customer module on `developer-purvansh` uses a clean repository/service pattern with
proper error classes — it is the best-engineered code in the repo.

**Why did good work go unreported?** Because it lives on branches that were never merged.
If it is not in an integration branch, it does not exist as far as anyone else can see.
That is a process problem, not a skill problem, and section 5 fixes it.

---

## 3. The harder finding: the code had never been run

This is the part that matters most, and it is not about any one person.

**Your status report described the code. It did not describe the system running.**

Here is the evidence, and we want you to see it as evidence rather than as criticism —
because the last item explains how this happened to careful people.

**`CreateBill.jsx` contained three separate errors that stop the app from building.**
A wrong import path, a missing `const addItem = () => {` line whose leftover brace was
closing the component 1000 lines early, and no closing brace at the end of the file. A
file cannot contain three build-breaking errors if anyone has ever opened that page in a
browser — the dev server refuses to start. That page is the only one in the app with real
API code, and it had never been loaded.

**Three tables that the code queries do not exist.** The code asks for `cash_book`,
`financial_security` and `attendance`. The real tables are `cash_ledger`, `financial_pin`
and `employee_attendance`. We confirmed this against the live database, not just the SQL
files. One single request to any of those endpoints would have returned "table doesn't
exist" immediately. Between them they break the dashboard, cash flow, the whole PIN
module and all of attendance — all of which were marked complete.

**Six files are completely empty (0 bytes) inside features marked ✅.**
`validate.js`, `errorHandler.js`, `auth.js`, `gstCalculator.js`, `invoiceGenerator.js`,
`exportModel.js`. "Validation Middleware ✅" and "GST Calculation ✅" both point at
empty files.

**And the reason none of this was caught:** your database connection was lying to you.

```js
const db = mysql.createPool({ ... });
console.log("MySQL Connected ✅");   // ← runs no matter what
```

`createPool()` does not connect to anything. It prepares a pool and returns instantly —
no network traffic happens until the first real query. That `console.log` was never
checking anything. **We ran this with MySQL completely stopped and it still printed
"MySQL Connected ✅".**

So every single startup showed a green light on the database, forever, whether MySQL was
running or not. If the system tells you the database is fine, you do not go looking for
missing tables. This was not carelessness. You were working from a signal that was wrong.

**The lesson worth carrying:** a message that always says "OK" is worse than no message.
Make your checks actually check something, and make failures loud.

---

## 4. The one habit that changes everything

If you take one thing from this document, take this.

> **A feature is done when you have called it and seen the response.
> Not when the file exists.**

That is the whole difference between your status report and reality. Concretely:

- ❌ "Billing API — done" because `billController.js` is written
- ✅ "Billing API — done" because `GET /api/bills` returned 200 with a list of bills,
  and here is the output

We ran your endpoints against the live database. This is what actually answers today:

**Working — returns 200 with real data:**
`/api/bills` · `/api/reports/sales` · `/api/analytics/monthly-revenue` ·
`/api/customer-orders` · `/api/makers` · `/api/gold-schemes/types` · `/api/employees` ·
`/api/auth/login`

**Failing — with the exact reason:**

| Endpoint | Error |
|---|---|
| `/api/dashboard` | `Table 'cash_book' doesn't exist` |
| `/api/cashbook/statement` | `Table 'cash_book' doesn't exist` |
| `/api/finance/balance-sheet` | `Table 'cash_book' doesn't exist` |
| `/api/finance/cash-flow` | `Table 'cash_book' doesn't exist` |
| `/api/financial-security/` | `Table 'financial_security' doesn't exist` |
| `/api/payments/history` | `Unknown column 'p.customer_id'` |
| `/api/income/history` | `Unknown column 'income_date'` |

**That table is your real status report.** Fifteen lines, honest, and every entry is
checkable. Please replace the feature-by-feature spreadsheet with something like this,
regenerated by actually running the endpoints.

Two of those failures — the payments and income ones — are column-level mistakes that
**no amount of reading the code would have found**. Payments was one of the best modules
in the project and it still had a real bug in it. Running it beat reading it.

---

## 5. About the frontend — please read this before planning

Your report listed most frontend modules as "🔄 API Integration", meaning in progress.
We measured it:

> **`useEffect` appears zero times across all 82 frontend files.**
> Exactly two files make network calls: the login form, and `CreateBill.jsx`.

Every dashboard widget, every customer page, every billing list, orders, suppliers,
payments — all of it is static markup. It looks finished, and the design work is genuinely
good, but **no screen fetches anything**.

This matters for planning more than for blame. "Integration in progress" suggests a small
amount of work remaining. In reality the frontend data layer has not been started. If you
schedule the remaining work as "just connect it up", you will be badly behind. Budget it
as new work, because it is.

The good news: once one module is wired properly, the rest follow the same pattern
quickly. Do the dashboard first — one endpoint feeds eight widgets that already exist.

---

## 6. How to do the merge

This is what you originally asked about. The full detail is in **`MERGE_PLAN.md`**; here
is the summary.

### Do not run `git merge` on the developer branches

Two people put different code in the **same folder**:

| Branch | Lives at | Style |
|---|---|---|
| `developer-riya` (finance) | `backend/src/` | CommonJS (`require`) |
| `developer-purvansh` (inventory) | `backend/src/` | ESM (`import`) |

`backend/src/app.js`, `backend/src/config/db.js` and `package.json` all collide head-on.
And even the files that do not collide cannot run together, because you cannot mix
`require` and `import` in one package.

Git will happily combine the text. The result will not run. **This is a restructuring
job, not a git job.**

### Agree these four things first — before anyone merges anything

Most merge arguments are really disagreements about one of these. Write the answers down
where everyone can see them.

1. **`import` or `require`?** Recommend **ESM**. About 80 files to convert (Riya's) versus
   110 the other way, and it matches the frontend.
2. **How do we connect to MySQL?** Recommend **Purvansh's promise pool**. Riya's code uses
   a single connection, which will fall over the moment two people use the app at once.
3. **What shape are API responses?** Right now there are three. Recommend Purvansh's
   `ApiResponse` / `ApiError` classes. The frontend cannot be built sensibly until this
   is settled.
4. **What do URLs look like?** `/api/v1/...` everywhere.

### Then merge module by module, in dependency order

Not all at once. One module, one pull request, in this order:

**Stage 0 — shared foundation** (one person, everyone reviews, merge before anything else)
db config, `ApiError`/`ApiResponse`, error handler, **write the empty `auth.js`**, new `app.js`

**Stage 1** — auth, then masters (categories, purity, metal types, stone types, designs)
**Stage 2** — customers, suppliers
**Stage 3** — products, inventory, purchase (PO/GRN/returns)
**Stage 4** — billing, payments
**Stage 5** — ledger, finance
**Stage 6** — orders/makers, gold scheme, security PIN, reports
**Stage 7** — HR (last: it needs the most repair)

**Start with masters.** Six near-identical CRUD modules, nothing depends on them and they
depend on nothing. It is the safest place to learn the new structure before touching
anything that matters.

### Three modules exist twice — decide per module, not per person

- **Customers** — keep Purvansh's (it has documents, notes, loyalty, VIP, analytics behind it)
- **Customer & supplier ledger** — keep Riya's (hers covers all six ledger types)

Note those go opposite ways. Judge each on which is actually more complete.

### One piece of good news

**The frontend needs no merge at all.** We checked: `billing-integration` already contains
everything in `frontend-vanshika` and everything in `auth-integration`, plus 23 more files.
It supersedes both. Vanshika is not blocked by the backend merge and should start wiring
screens now, module by module, as each backend module lands.

### Rules for every merge PR

1. Branch `merge/<module-name>` from the integration branch
2. Move files into `src/modules/<module>/`
3. Convert to the four agreed decisions
4. Mount it in `app.js`
5. **Call every endpoint once and paste the results into the PR**
6. Someone else reviews before merge

Step 5 is the one that matters. A module is merged when its endpoints answer correctly,
not when the code is in the folder.

---

## 7. What has already been fixed for you

So you do not redo it. All of this is on the branch `rebuild/foundation`.

| Fixed | What it was |
|---|---|
| **One server, one port** | The two Express apps are now one. The whole API is served together |
| **One command to run everything** | `npm run dev` starts MySQL, backend and frontend together |
| **The port mismatch** | The frontend now calls `/api` and Vite forwards it. **CORS is no longer involved at all** — same-origin requests cannot produce a CORS error |
| **`bcryptjs` installed** | It was required but never in `package.json` |
| **`CreateBill.jsx` builds** | The three syntax errors are fixed |
| **MySQL starts automatically** | It was not running at all, and nothing was configured to start it |
| **Login works end to end** | Route guards written (they were empty files), dropdown and logout built, redirect after login added |
| **Toast messages appear** | `main.jsx` had orphaned dead code, so `<Toaster />` was never mounted. Every error message in the app was silently discarded |

Log in with `admin@jljewellers.com` / `Admin@123`.

**One correction we owe you:** we initially reported that the JWT token was broken
(signed with the literal string `"secret"`). That is true on `main` and
`developer-aditya` — but **`billing-integration` already has it fixed properly**, with a
real secret, the correct `user_id`, an active-account check and good error handling. It is
the best-written file in the auth area and we got it wrong by reading the wrong branch's
copy. Whoever wrote that version: it is good, and do not let the broken one overwrite it
during the merge.

---

## 8. What changed since this briefing was written

*Updated 2026-08-17. The section that was here told you every route was
unauthenticated and that writing `auth.js` was your first assignment. Both were
true when it was written. Neither is true now, and following it would leave you
stuck on errors this document did not explain.*

### Every API call now needs a token

This is the one thing that will stop you if you do not know it.

`middleware/auth.js` is written, tested and mounted on the `/api` router, so
**every route below `/auth` requires a valid token**. A request without one gets:

```
401  {"success": false, "message": "Not signed in"}
```

That is not a bug in your code. It is the system working.

You do not need to do anything special in the app — `services/api.js` is the
only axios instance and attaches the token to every request automatically. It
matters when you test by hand:

```bash
# get a token
curl -s -X POST http://127.0.0.1:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jljewellers.com","password":"Admin@123"}'

# use it
curl -s http://127.0.0.1:5000/api/v1/bills -H "Authorization: Bearer <token>"
```

Two things that will confuse you the first time:

- **Ten wrong passwords locks login for five minutes.** It blocks the *correct*
  password too — it cannot tell you from an attacker. Wait it out.
- **A token dies when you log out, and after a day.** The app sends you back to
  the login screen automatically when that happens.

### Other things that are no longer true

| The briefing said | Now |
|---|---|
| `auth.js` is 0 bytes — write it | Written and mounted on all 41 route files |
| Every route is unauthenticated | Every route requires a token (`/uploads` is the one exception) |
| Bills are numbered with `Date.now()` | Proper GST serial numbers — `INV/2026-27/0016` |
| Receiving goods does not update stock | It does, and deleting the receipt reverses it |
| The backlog has 61 open items | 68 found, 37 closed, **31 open** |

`CHANGES.md` explains each of these in plain language, with what the problem was
and how it was fixed.

---

## 8a. What to work on

The merge is done. 92 endpoints answer, both server sweeps pass, and all 19
screens render. What is left is genuinely different work from what this
document originally described.

### The real remaining work: eight modules have a backend and no screen

| Module | Endpoints ready | Screen |
|---|:--:|---|
| Inventory | 14 | none |
| Reports | 6 + exports | none |
| Business intelligence | 8 | none |
| Ledgers | 6 | none |
| Finance | several | none |
| Makers / Karigars | ~10 | none |
| Gold schemes | ~12 | none |
| Notifications, Settings | — | none |

This is the best work in the project to be given. The hard question — *does the
server actually do this correctly?* — is already answered, so you are free to
concentrate on the part that is genuinely yours: what the screen should show,
what the shopkeeper needs to see first, and what happens when there is no data
yet.

Pick one module and take it end to end rather than starting several.

### Three checks to run before you say something works

A feature is done when you have called it and seen the response — not when the
file exists. That rule is why this project was in the state it was.

```bash
node scripts/sweep.cjs          # 92 read endpoints
node scripts/sweep-writes.cjs   # 10 write paths, with real transactions
cd frontend && npm run check:render   # every screen renders
```

The third one exists because of a mistake worth learning from. The two server
sweeps were passing green while **two screens were completely blank** — the
faults were in the pages, and no amount of server testing could see them. If
you only test the API, you will make the same mistake.

## 9. Where to read more

| Document | What is in it |
|---|---|
| `FEATURE_STATUS_AUDIT.md` | Every feature, checked against the code and the database |
| `REMEDIATION_BACKLOG.md` | Every item rated by severity — 68 found, 37 closed, 31 open. Struck-through rows are done |
| `MERGE_PLAN.md` | The module-by-module merge plan. Historical now: the merge is finished |
| `MERGE_LOG.md` | What was taken from which branch, and why |
| `CHANGES.md` | Everything changed so far, in plain language — start here |

---

## A closing note

It is worth being clear about what this review did and did not find.

It did **not** find that you cannot code. The schema design is genuinely strong. The
payments and billing logic is solid. The UI work is careful and looks good. Four modules
are further along than you gave yourselves credit for.

What it found is that **four people worked in separate branches for weeks without ever
running the system together**, and a false "MySQL Connected ✅" message hid the
consequences. That is a process failure, and process failures are the easy kind to fix.

You now have a system that starts with one command and a login that works. The next step
is to make "done" mean "I ran it and here is the output". Everything else follows from
that.
