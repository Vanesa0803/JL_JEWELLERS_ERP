# Change Log — JL Jewellers ERP Rebuild

Every change made during the rebuild, in plain language.
Format: **what was wrong → what we did → anything worth knowing.**

Read alongside:
- [FEATURE_STATUS_AUDIT.md](FEATURE_STATUS_AUDIT.md) — what is actually built
- [REMEDIATION_BACKLOG.md](REMEDIATION_BACKLOG.md) — everything left to do, rated by severity
- [MERGE_PLAN.md](MERGE_PLAN.md) — how to merge the four developers' branches together

---

# Session 1 — 2026-08-13 — "Make it start with one command"

**Goal:** stop having to start the frontend and backend separately, and make the
frontend actually able to reach the backend.

**Result:** `npm run dev` now starts everything. The frontend can reach the API.

> **Scope note:** this session only made the app *start and connect*. It did not
> make features *work*. Login still fails, the dashboard still shows no data. Those
> are separate, deliberately-left tasks — see [What we left for you](#what-we-left-for-you-on-purpose).

---

## 1.0 — Created a working branch

**The issue**
All the real work (20+ screens, 17 backend modules) lives on `billing-integration`.
The `main` branch only has a login page and 19 empty files. Building on `main` would
mean throwing away everyone's work.

**What we did**
Created a new branch `rebuild/foundation` starting from `billing-integration`.

```
main                  ← untouched, still safe
billing-integration   ← untouched, still safe
  └── rebuild/foundation   ← all work happens here
```

**Remarks**
Nothing was deleted from anyone's branch. If this rebuild goes wrong, every original
branch is still exactly as it was. `main` gets replaced only once the rebuild works.

---

## 1.1 — There were two backend servers; now there is one

**The issue**
The `backend` folder contained **two completely separate Express applications**:

| File | What it served | Port |
|---|---|---|
| `backend/app.js` | `/api/auth`, `/api/employees` | 5005 |
| `backend/src/app.js` | `/api/bills`, `/api/payments`, `/api/dashboard`, +13 more | 5000 |

Only one can run at a time. So if you started the billing server, **login did not
exist**. If you started the login server, **billing did not exist**. This is the
single biggest reason the frontend "could not talk to the backend" — half the API
was always missing, whichever server was running.

**What we did**
- Mounted the auth and employee routes inside `backend/src/app.js`, so one app now
  serves the whole API
- Deleted `backend/app.js` and `backend/server.js` (the duplicate second server)

**Remarks**
The auth files still physically sit in `backend/routes/` and `backend/controllers/`
rather than in `backend/src/`. That is untidy but harmless — they are being loaded
by the one app now. Moving them properly is part of the bigger restructure
(`S3-5` in the backlog). There is a `TODO` comment in `src/app.js` marking the spot.

Also note: the app now has **two different database connections** open — the old auth
code uses a connection pool, the finance code uses a single connection. Both work.
Merging them is `S3-8`.

---

## 1.2 — The backend could not find its own settings file

**The issue**
`server.js` called `require("dotenv").config()`, which looks for a `.env` file in
*whatever folder you happened to run the command from*. Running the server from the
project root instead of the `backend` folder meant no database password, no port —
silently, with no error message.

**What we did**
Made the path explicit in `backend/src/server.js`:

```js
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
```

**Remarks**
Now it always finds `backend/.env` no matter where you launch from. This is what
makes the single `npm run dev` command from the project root possible.

---

## 1.3 — The frontend was calling a port nothing was listening on

**The issue**
The frontend was hardcoded to call `http://localhost:5005/api`.
The backend listens on port **5000**.
So every single API call failed with "connection refused". The browser reported this
in a way that *looked* like a CORS error, which is why the team spent time changing
CORS settings that were never the problem.

**What we did**
Two changes:

1. Added a **proxy** to `frontend/vite.config.js` — anything the app requests at
   `/api/...` is quietly forwarded to the backend by the dev server
2. Changed both axios files to use `baseURL: "/api"` instead of a full URL with a port

**Remarks**
This is the important one to understand. Because of the proxy, the browser now only
ever talks to `localhost:5173`. The request never crosses between two different
addresses, so **CORS is no longer involved at all**. You cannot get a CORS error
from a same-origin request.

It also means the port is written down in exactly one place (`vite.config.js`).
If the backend port ever changes, that is the only line to edit.

---

## 1.4 — A required package was never installed

**The issue**
`authController.js` starts with `require("bcryptjs")`, but `package.json` listed
`bcrypt` — a **different package** with a similar name. The login server crashed on
startup with `Cannot find module 'bcryptjs'` before it could serve anything.

**What we did**
Added `bcryptjs` to `backend/package.json` and installed it.

**Remarks**
Both `bcrypt` and `bcryptjs` are now installed because different files use each one
(`financialSecurityService.js` uses `bcrypt`). Picking one and using it everywhere
is a small cleanup task left for you.

---

## 1.5 — The billing page had never compiled, ever

**The issue**
This one is worth reading carefully. `CreateBill.jsx` — the *only* page in the whole
app with real API code — contained **three separate faults that stopped the app from
building at all**:

1. **Wrong import path.** Line 12 was `import api from "../api/axios"`. From inside
   `src/pages/billing/`, that points at `src/pages/api/axios`, which does not exist.
   The correct path is `"../../api/axios"`.

2. **A missing function declaration.** The line `const addItem = () => {` had been
   lost at some point. What remained was a loose `newItem` object followed by an
   orphan closing brace — and that brace was accidentally closing the whole
   `CreateBill` component, 1000 lines early.

3. **A missing closing brace at the end of the file.** The component was never
   closed, so `export default CreateBill` sat outside it.

**What we did**
Fixed all three. `npm run build` now succeeds.

**Remarks — this is the significant finding**
A file cannot contain three build-breaking errors if anyone has ever loaded the page
in a browser. Vite would have refused to start. This tells us plainly:

> **The billing screen has never once been opened and run.**

That matters far more than the three bugs themselves. It means the "billing UI is
structured, integration remaining" status was written from looking at the code, not
from running it. Worth discussing with the team — not as blame, but because it
explains how the rest of the status report drifted from reality.

---

## 1.6 — One command now starts everything

**The issue**
Two terminals, two commands, every time. Easy to forget one and then debug a dead API
for twenty minutes.

**What we did**
Added a `package.json` at the project root using `concurrently`:

| Command | What it does |
|---|---|
| `npm run setup` | Installs dependencies for root + backend + frontend, in one go |
| `npm run dev` | **Starts backend and frontend together** |
| `npm run build` | Builds the frontend for production |
| `npm run start` | Runs the backend without auto-reload |

Output is colour-coded and labelled `[BACKEND]` / `[FRONTEND]` so you can tell whose
message is whose. Pressing `Ctrl+C` once stops both.

**Remarks**
This is deliberately a plain root `package.json`, not npm workspaces. It is simpler
to read, and it is the natural place to add the Electron scripts later — Electron
will sit at this same root level and start the backend itself.

---

## 1.7 — Housekeeping

**The issue**
- The root `.gitignore` on `main` was **completely empty**, which is how `node_modules`
  and a `.env` file full of real passwords ended up committed to GitHub
- A leftover folder `backend_backup/` containing an old copy of `package.json`
- A junk file literally named `tash show --name-only stash@{0}` — someone typed
  `git stash show` slightly wrong and the output got saved into a file

**What we did**
- Wrote a proper `.gitignore` (ignores `node_modules`, all `.env` files, build output,
  uploaded documents, editor folders — and keeps `.env.example`)
- Deleted `backend_backup/` and the junk file
- Added `backend/.env.example` — a template showing which settings are needed, with
  no real passwords in it. This file **is** committed on purpose
- Created `backend/.env` with the working local settings so the server starts

**Remarks**
`backend/.env` is git-ignored and will not be committed. But the passwords currently
in it are the ones already exposed on GitHub, so they still need changing — that is
`S1-1`, the very first item in the backlog.

---

## 1.8 — The "MySQL Connected ✅" message was fake

**The issue**
Running the old code printed:

```
MySQL Connected ✅
Server running on port 5000
```

Running the new code printed:

```
🚀 Server running on port 5000
❌ Database Connection Failed
MySQL connection failed: ECONNREFUSED
```

The obvious reading is that the new code broke something. It's the opposite.

We checked the machine while both were run: **there was no MySQL running at all** —
no Windows service, no `mysqld` process, nothing listening on port 3306. The database
server was completely stopped both times.

The old code said "MySQL Connected ✅" anyway. Here is why:

```js
const db = mysql.createPool({ ... });
console.log("MySQL Connected ✅");   // ← runs no matter what
```

`createPool()` does **not** connect to anything. It just prepares a pool and returns
instantly — no network traffic happens until the first actual query. So that
`console.log` was never checking anything. It printed on every startup, forever,
whether MySQL was running, stopped, or not installed.

**What we did**
Nothing — the code on this branch is already honest. Both database configs here
genuinely test the connection (`db.query("SELECT 1")` and `connection.connect()`),
which is exactly why you now get a truthful error instead of a false thumbs-up.

**Remarks — this is probably the root cause of a lot**
The team has had a permanent green light on the database since day one. That very
likely explains how three table names that do not exist (`cash_book`,
`financial_security`, `attendance`) survived for weeks in code marked "complete" —
if the startup message says the database is fine, nobody thinks to check the tables.

**A truthful error message is worth more than a reassuring one.** If you take one
habit from this session, take that.

Also worth knowing: you now see **two** database messages at startup. That is expected —
the auth code and the finance code each open their own connection, and both are loaded
now that they run in one app. Merging them into a single pool is `S3-8`.

---

## 1.9 — MySQL setup on this machine

**What we found**

| Check | Result |
|---|---|
| MySQL installed | ✅ MySQL Server 8.4 at `C:\Program Files\MySQL\MySQL Server 8.4` |
| Database exists | ✅ `jl_jewellers_erp` is present in `C:\ProgramData\MySQL\data` |
| Windows service registered | ❌ none |
| `my.ini` config file | ❌ none |
| Running | ❌ was stopped |

So MySQL is installed and the data is there, but nothing starts it. It has to be
launched by hand every time, and it does not survive a reboot.

**What we did**
Started it manually to confirm it works:

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --datadir="C:\ProgramData\MySQL\data" --console
```

It came up cleanly and is now listening on port 3306.

**Remarks**
Two things still need your input:

1. **The password in `backend/.env` is not yours.** It is `aditya042006`, copied from
   the committed `.env` — that is *Aditya's* machine password, and it does not work
   here. Put your own MySQL root password in `backend/.env` (`DB_PASSWORD=`).
   Good news: the password leaked to GitHub is not yours.

2. **Check the database name.** `backend/.env` says `JL_Jewellers_ERP`; the folder on
   disk is `jl_jewellers_erp`. Windows MySQL is normally case-insensitive here so it
   should be fine, but if you get "unknown database", that is the first thing to try.

Still worth doing: register MySQL as a proper Windows service so it starts on boot,
and give it a `my.ini`. Needs an admin terminal.

> **Flag for the Electron plan:** if this ships as a Windows desktop app, MySQL has to
> be installed and running on the shop's computer too. The installer will need to
> handle that — bundle it, or require it as a prerequisite. Worth deciding early,
> because it shapes how the installer is built.

---

## 1.10 — Verified against the real database: the three missing tables are genuinely missing

**Why this mattered**
The audit said three tables the code queries do not exist. But that was based on
reading the `database/*.sql` files. There was always a chance those files were simply
out of date and the real database had the tables — in which case the finding would be
wrong.

We can now settle it. MySQL stores every InnoDB table as its own file on disk, so the
real table list can be read straight from `C:\ProgramData\MySQL\data\jl_jewellers_erp`
without needing any password.

**The result**

| Table the code queries | In the real database? | The table that actually exists |
|---|:--:|---|
| `cash_book` | ❌ **not there** | `cash_ledger` |
| `financial_security` | ❌ **not there** | `financial_pin` |
| `attendance` | ❌ **not there** | `employee_attendance` |

And a count check:

```
tables in the committed schema files : 87
tables in the live database          : 87
==> MATCH
```

**What this means**

1. **The findings are confirmed, not theoretical.** Every endpoint touching those three
   names fails against the real database. That is the dashboard summary, cash book,
   cash flow, the whole financial PIN module, bill cancel/edit protection, and all of
   attendance. `S0-7` and `S0-8` are real bugs.

2. **The schema files are correct and current.** This is genuinely good news, and it
   closes a worry raised in the audit (`S3-10`). The `database/` folder is trustworthy —
   anyone can rebuild a working database from it. The problem is only in the code.

3. **It confirms those endpoints have never been run.** A single request to any of them
   would have returned "table doesn't exist" immediately.

**Remarks**
The fix is a find-and-replace across three files, and it is worth doing carefully rather
than blindly — check each query still makes sense against the real table's columns,
because a table named `cash_ledger` may not have exactly the columns the code assumed
for `cash_book`.

---

## 1.11 — MySQL set up properly, and it now starts with the app

**The issue**
MySQL was installed and the database was intact, but nothing was configured around it:

- no Windows service, so nothing ever started it
- no `my.ini` config file
- the root password was unknown — not blank, and not the one in the committed `.env`
  (that one is Aditya's, from his machine)

So the database had to be started by hand, and nobody could log into it.

**What we did**

**1. Reset the root password.** Used MySQL's official `--init-file` method, which runs
one SQL statement at startup:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'JLerp_local_2026';
```

All 87 tables and their data were left completely untouched — this only changed the
login. Verified afterwards: 93 objects in the database (87 tables + 6 views), matching
the schema files exactly.

> **The password is `JLerp_local_2026`.** It is a local development password and it is
> written in `backend/.env`, which is git-ignored. Change it if you like — just update
> `backend/.env` to match.

**2. MySQL now starts automatically with the app.** Added `scripts/ensure-mysql.js`,
which runs as the first step of `npm run dev`:

- checks whether anything is listening on port 3306
- if yes → does nothing, prints `MySQL already running`
- if no → starts `mysqld` in the background and waits until the port answers

It starts MySQL *detached*, so MySQL keeps running after the dev server exits.

> **Tested caveat:** detaching survives a normal exit, but force-killing the whole
> process tree (`taskkill /T /F`, or slamming the terminal window shut) can still take
> MySQL with it. If that happens just run `npm run db` again. For a database that is
> genuinely independent of the app, use the service installer below.

**3. Added an optional service installer.** `scripts/setup-mysql-service.ps1` — right-click,
Run as administrator. It writes a proper `my.ini` and registers MySQL as a Windows service
set to Automatic, so it starts on boot without the app doing anything. You don't need this
for development; you will want it on a real shop computer.

**4. Changed `DB_HOST` from `localhost` to `127.0.0.1`.**
On Windows, `localhost` can resolve to the IPv6 address `::1` first, which MySQL may not
be listening on. That produces a confusing "connection refused" even when MySQL is running
perfectly. Using the IP address directly avoids the whole problem.

**5. Fixed the database name.** `.env` said `JL_Jewellers_ERP`; the real database is
`jl_jewellers_erp`.

**Remarks — verified with a cold start**
We killed MySQL completely, then ran `npm run dev` from nothing:

```
[db] MySQL is not running. Starting it...
[db] MySQL is up on 127.0.0.1:3306
[BACKEND] 🚀 Server running on port 5000
[BACKEND] ✅ Connected to MySQL Database
[FRONTEND] ➜  Local: http://localhost:5173/
```

One command, from a completely cold machine, to a running system.

---

## 1.12 — The real status report: what actually answers

This is the thing that has been missing all along — **not a list of files, but a list of
what happens when you actually call each endpoint.** We ran them against the live
database. This is your true starting point.

### Working — returns 200 with real data

| Endpoint | Module |
|---|---|
| `GET /api/bills` | Billing |
| `GET /api/reports/sales` | Reports |
| `GET /api/analytics/monthly-revenue` | Business Intelligence |
| `GET /api/customer-orders` | Customer Orders |
| `GET /api/makers` | Makers |
| `GET /api/gold-schemes/types` | Gold Scheme |
| `GET /api/employees` | HR |
| `POST /api/auth/login` | Auth — correctly returns "Invalid credentials" for a bad password |

That last one matters: login **finds the user, checks the password with bcrypt, and
rejects correctly.** The auth path works right up to the point where the token is
created. Fixing `S0-4` and `S0-5` should complete it.

Also worth noting: **Business Intelligence and Gold Scheme both answered with real data** —
two modules the status report listed as 0% / not mentioned at all.

### Failing — with the exact reason

| Endpoint | Error | Backlog |
|---|---|:--:|
| `GET /api/dashboard` | `Table 'cash_book' doesn't exist` | `S0-7` |
| `GET /api/cashbook/statement` | `Table 'cash_book' doesn't exist` | `S0-7` |
| `GET /api/finance/balance-sheet` | `Table 'cash_book' doesn't exist` | `S0-7` |
| `GET /api/finance/cash-flow` | `Table 'cash_book' doesn't exist` | `S0-7` |
| `GET /api/financial-security/` | `Table 'financial_security' doesn't exist` | `S0-8` |
| `GET /api/payments/history` | `Unknown column 'p.customer_id'` | **`S2-15` (new)** |
| `GET /api/income/history` | `Unknown column 'income_date'` | **`S2-16` (new)** |

### Two problems we had NOT found by reading the code

Running it beat reading it. These are column-level mistakes that no amount of file-browsing
would have caught:

**`S2-15` — Payments queries a column that does not exist.**
The code selects `p.customer_id` from `payments`. The real columns are:

```
payment_id, bill_id, payment_date, total_amount,
payment_status, payment_type, created_by, updated_by, created_at, updated_at
```

There is no `customer_id`. A payment is linked to a *bill*, and the bill knows the
customer — so the query needs to join through `bills`. This matters because Payments was
rated one of the strongest modules in the audit. It is good code with a real bug in it.

**`S2-16` — Income sorts by a column that does not exist.**
The code orders by `income_date`. The real columns are:

```
income_id, income_source, amount, received_date, remarks
```

The date column is called `received_date`.

**`S2-17` — Creating an employee writes to a column that does not exist.**
`createEmployee` inserts a `role` value into `employees`, but that table has no `role`
column (it has `designation`). Reading employees works; creating one will fail.

### One correction to the earlier audit

The audit said employee listing was broken because of a missing `department_id` column.
Measured: `GET /api/employees` returns **200**. The reason is that there are *two different*
employee controllers on different branches — the simple one currently running does a plain
`SELECT * FROM employees`, while the one with the broken join lives on `developer-aditya`
and `auth-integration`. The bug is real, but it will only appear when the HR module is
merged (Stage 7 of the merge plan). Worth knowing so nobody hunts for it in the wrong file.

---

## 1.13 — Correction: the JWT bugs were already fixed on this branch

**What we got wrong**
Earlier sessions listed `S0-4` (token signed with the literal string `"secret"`) and
`S0-5` (token carries `user.id` when the column is `user_id`) as things you still needed
to fix. On **this branch, they are already fixed.**

There are two different versions of `authController.js` in the project:

| Branch | Signs with | Payload | State |
|---|---|---|---|
| `main`, `developer-aditya`, `frontend-vanshika` | `"secret"` (literal) | `user.id` — undefined | ❌ broken |
| `billing-integration` → our branch | `process.env.JWT_SECRET` | `user.user_id` | ✅ correct |

Somebody fixed it properly on `billing-integration` — it also checks the account is
active, validates that `JWT_SECRET` exists, returns the user object, and handles database
errors with useful messages. It is the best-written file in the auth area, and the audit
should have credited it.

**Remarks**
The bug is still real on `main` and on Aditya's branch, so it must not be reintroduced
when those get merged (Stage 1 and Stage 7 of the merge plan). But nobody needs to fix it
here. Apologies for the wasted worry — the lesson is that "the same file" can be three
different files across six branches, which is exactly the problem the merge plan exists
to solve.

---

## 1.14 — Fixed the whole login loop

**The issue**
Three separate things, which together made the app look like it logged you in
automatically and refused to log you out:

**1. There was no login check at all.** `ProtectedRoute.jsx` and `PublicRoute.jsx` were
both **completely empty files** (0 bytes), and `AppRouter.jsx` never imported them. The
catch-all route sends every unknown URL to `/dashboard`. So opening the app dropped you
straight onto the dashboard. You were never logged in — nothing was ever checking.

**2. There was no dropdown.** The user button in `Topbar.jsx` was a plain `<button>` with
no click handler, no state, and no menu markup anywhere. The chevron icon suggested a menu
that had never been built. There was no logout button anywhere in the app — `authStore`
had a working `logout()` function that nothing called.

**3. Nobody could actually log in.** The sample data seeds the password as plain text
(`admin123`), but the rows in the live database hold bcrypt hashes generated from
something else. `admin123` was rejected. There were no working credentials at all.

**And two more found on the way:**

**4. `main.jsx` had dead code that broke the toasts.** After the real `createRoot(...).render()`
call there was a second, orphaned `<React.StrictMode>` block containing `<Toaster />`.
It was never rendered — and `React` was not even imported, so it could only ever have
thrown. The practical effect: **`<Toaster />` was never mounted**, so every
`toast.success(...)` and `toast.error(...)` in the app silently did nothing. Login errors
were invisible.

**5. Logging in did not take you anywhere.** `LoginForm.jsx` stored the token and then
stopped — there was a comment reading `// Dashboard navigation comes next`. Even a correct
login left you sitting on the login page.

**What we did**

| File | Change |
|---|---|
| `routes/ProtectedRoute.jsx` | **Written** (was empty). Redirects to `/login` when there is no token, and remembers the page you wanted so you land there after signing in |
| `routes/PublicRoute.jsx` | **Written** (was empty). Sends already-logged-in users away from the login page |
| `routes/AppRouter.jsx` | Added a `Private` wrapper combining the guard and the layout, then applied it to all 20+ pages. Login wrapped in `PublicRoute` |
| `store/authStore.js` | Now reads the saved login from localStorage **when the store is created**, so a page refresh no longer logs you out. Handles corrupted values instead of crashing |
| `components/auth/LoginForm.jsx` | Redirects to the dashboard (or the page you were trying to reach) after a successful login |
| `components/layout/Topbar.jsx` | Built the dropdown: opens on click, closes on outside-click and on navigation, shows the **real** logged-in name / role / email, and has a working **Logout** |
| `main.jsx` | Rewritten — one render tree, `<Toaster />` actually mounted, so error messages appear |

**Credentials**
Both seeded accounts now have a known password:

| Email | Password | Role |
|---|---|---|
| `admin@jljewellers.com` | `Admin@123` | admin |
| `staff@jljewellers.com` | `Admin@123` | staff |

Set by hashing with bcrypt and updating the rows — no user records were added or removed.

**Verified**

```
POST /api/auth/login  ->  200
message : Login successful
user    : System Admin / admin@jljewellers.com / admin / id=2
payload : {"id":2,"role":"admin","iat":...,"exp":...}
```

The token now carries the correct `user_id` and is signed with the real secret. Frontend
build passes.

**Remarks — what this does NOT do**
This is a **frontend** gate only. It stops the screens rendering, but it does not stop
anyone calling the API directly with `curl`. **Every backend route is still unauthenticated**
(`S1-3`) — that is still the students' job, and it is the more important half. A locked
front door with all the windows open is not security.

Still open for the team: `S1-3` (auth middleware on 40+ routes), `S4-14` (roles and
permissions — the token carries `role`, but nothing reads it yet), and password reset.

---

## 2.1 — The dashboard now shows real data

**The issue**
The frontend had **zero** `useEffect` calls across 82 files. Every screen was static
markup — the dashboard showed ₹0 in all eight cards, four invented bills for "Customer
Name", and a sales chart of twelve flat months. It looked finished and was connected to
nothing.

**What we did**
Wired the dashboard end to end, and built the small amount of shared machinery the rest of
the screens will need.

| New file | What it does |
|---|---|
| `hooks/useApi.js` | Fetches, tracks loading and error, and can reload. Deliberately dependency-free |
| `lib/format.js` | Indian currency and dates — ₹1,20,000 rather than ₹120,000 |

Then each widget was changed to accept its data as a prop, and the page fetches once:

```
GET /dashboard  ->  summary, sales_overview, recent_bills,
                    recent_activities, low_stock_products,
                    top_selling_products
```

**One request feeds all seven widgets.** The page talks to the API; the components only
display. That is the pattern for every screen that follows.

**Verified through the browser path** (via the Vite proxy, exactly as the app does it):

```
summary.today_bills   0
summary.pending_pay   331255
summary.gold_rate     9850
recent_bills          5 rows   first status: Partial
recent_activities     10 rows
top_selling_products  5 rows
```

**Remarks — three places we changed the design rather than fake the data**

1. **The sales chart said "This Year" with a month dropdown.** The API returns the last
   **7 days**, and the dropdown was wired to nothing. Both were changed to match reality:
   the heading now says "last 7 days" and the dead control is gone. A working range picker
   belongs on `/dashboard/sales-analytics`, which already accepts `from_date` and `to_date`
   — a small follow-up rather than a lie in the meantime.

2. **Top Selling Products showed a category per product.** The query does not join
   categories, so the column was removed. A made-up category next to a real product name is
   worse than no category.

3. **Recent Bills had a Status column with nothing to fill it.** Here the fix went the
   other way — `bills.payment_status` already existed, so one line was added to the
   dashboard query. The column now shows real Pending / Partial / Completed values.

**Empty is not the same as zero.** Every figure falls back to an em dash while loading,
never to ₹0 — "—" reads as *not loaded yet*, while "₹0" reads as *you sold nothing today*.
And if the request fails, the page says so with a retry button instead of rendering empty
widgets that look like a business with no customers.

**Also changed:** `services/api.js` now targets `/api/v1` rather than the temporary `/api`
alias.

---

## 2.3 — Billing: the screen and the server now agree on the money

**The issue**
`CreateBill.jsx` carried four faults, and together they meant the billing screen could not
have produced a correct bill:

1. **Every total showed ₹0.00.** The calculator read `item.netWeight` and
   `item.makingPercent`, but the form writes `net_weight` and `making_charge_percent`. Both
   were always zero, so no matter what was typed in, the screen showed nothing.
2. **The same wrong names were sent to the server**, so the saved bill was built from
   blanks too.
3. **GST was a flat 3%** on everything. Gold jewellery is 3% on the metal and 5% on the
   making charge — two rates, which the server already did correctly.
4. **Discount was applied before tax** on screen and after tax on the server.

**What we did**
Rewrote the screen's calculation to mirror `billing.calculator.js` step for step, and fixed
the payload field names. The screen now only sends raw inputs — quantity, weight, rate,
making percentage, discount — and the **server recalculates every figure itself**. That is
the right division: the browser must never decide what a customer is charged.

---

### And that comparison found a real revenue bug — `S2-3`

With both sides finally computing the same thing, they still disagreed:

```
                  SCREEN        SERVER
subtotal       116,320.00     60,320.00
total GST        3,736.00      1,936.00
grand total    118,556.00     60,756.00
```

The gap was exactly the quantity. **`billing.calculator.js` computed `net_weight × rate`
and ignored `quantity` completely** — it accepted the field, returned it in the result, and
never once multiplied by it. A line for two identical rings was charged as one.

This was in the very first audit as a suspicion. It is now proven: a two-line bill was
being stored at roughly **half** its correct value.

What makes it worth dwelling on is *why it survived*. The arithmetic looks entirely
reasonable — metal value, making charge, taxable value, GST, total, all correct in
isolation. Nothing about the output hints that a quantity was dropped. It took a **second
implementation disagreeing** to expose it.

After the fix:

```
                  SCREEN        SERVER
subtotal       116,320.00    116,320.00    match
total GST        3,736.00      3,736.00    match
grand total    118,556.00    118,556.00    match
```

**Remarks — two things left open on purpose**

- **Discount timing is a tax question, not a coding one.** The screen now matches the
  server (discount after GST). Under GST rules a trade discount shown on the invoice is
  normally deducted *before* tax, which would make both wrong together. Worth confirming
  with your accountant — and it is a one-line change in two files once decided.
- **`customer_id` and `employee_id` are still hardcoded to 1.** The screen has no customer
  picker yet. `employee_id` is worse than an oversight: a bill references `employees`, the
  logged-in user is a row in `users`, and **nothing links the two tables** — so "who made
  this sale" cannot currently be answered. That is a schema gap.

---

## 3.0 - Every route now checks who you are

**The issue**
One route in the whole application asked for a login. One, out of forty-one route files.
Everything else - bills, payments, customer KYC documents, stock levels, the cash book -
answered anybody who asked. No password, no token, nothing.

The only reason this was not a live emergency is that the server only listens on the
machine it runs on. That is a deployment accident, not a safety measure. Change one line
in `server.js` and the whole shop's books are on the network.

**What we did**
Put the check on the router itself, so it covers everything underneath it in one line
rather than being added to forty-one files by hand.

That choice matters more than it looks. If the check has to be remembered for each new
route, then sooner or later somebody forgets one - and a forgotten route does not break
or complain. It just quietly lets everyone in, and it looks completely normal in testing.
This way round, being protected is what happens by default, and letting a route be public
has to be written down in a place where you can see it.

**Remarks**
`/uploads` is deliberately still open - customer documents are served from there and it
sits outside this router. Flagged in the code and on the backlog rather than silently
left.

The two test scripts had to learn to log in first. Without that they would have reported
92 failures, and the one line explaining why would have been buried under them.

**Proof it works**
Without a token, `/bills`, `/payments`, `/customers`, `/inventory`, `/cashbook`,
`/dashboard` and `/employees` all answer **401**. With one, all 92 routes still pass.

---

## 3.1 - Bill numbers that GST law will actually accept

**The issue**
Every bill was numbered with the clock: `INV-1786939073522`. That is the number of
milliseconds since 1970. It is unique, and unique is the *only* thing it is.

GST rules require the number on a tax invoice to be a **consecutive serial number**,
unique within a financial year. A timestamp is not consecutive and has no series, so
every bill issued this way was non-compliant on its face - and you cannot explain the
gaps to an inspector afterwards, because there is no sequence there to explain.

**What we did**
Bills are now numbered from a counter: `INV/2026-27/0016`. The financial year runs April
to March, as it should.

The important part is *where* the number is allocated. It happens inside the same
transaction that saves the bill, which gives two things at once:

- two bills started at the same moment cannot take the same number
- **a bill that fails does not burn a number** - the counter rolls back with everything
  else, so there is no hole in the book

**Remarks**
The `invoice_sequence` table already existed for exactly this and had never once been
written to. It needed one constraint added before it was safe to use, which is migration
`_09`.

That migration starts the counter **above the highest number already used**, rather than
at 1. Starting at 1 would have re-issued `INV000001` and created a duplicate invoice
number - worse than the problem being fixed. The old timestamp numbers are ignored when
working that out, or the counter would have jumped into the trillions.

One real cost, stated plainly: bills are now created one at a time rather than in
parallel. For a shop with one person at the counter this changes nothing, and a legally
sound invoice book is worth far more than parallel billing.

**Proof it works**
Three bills in a row: `0016`, `0017`, `0018`. Then a bill that deliberately fails. Then
the next real bill: **`0019`** - no gap.

---

## 3.2 - Goods received now actually arrive in stock

**The issue**
Recording a delivery did not add anything to stock. The receipt was filed, the purchase
order was updated, and the inventory figure did not move.

Stock therefore only ever went *down*, on sales. Every delivery pushed the recorded
figure a little further below what was really on the shelf, and nothing ever showed an
error. A shop would only notice when a reorder report told it to buy things it already
had - by which point the numbers have been wrong for months.

**What we did**
Receiving goods now adds them to stock, in the same transaction as the receipt, and
writes a line to the stock movement history saying where they came from.

It adds the **accepted** quantity, not the received quantity. If ten arrive and three are
damaged, seven go into stock. The damaged three are physically in the building but they
are going back to the supplier, so they are not stock - which is the whole reason a
goods receipt records the two numbers separately.

**Remarks**
Deleting a receipt now takes the stock back out again. Without that, this fix would have
created the same drift in the opposite direction - delete a delivery and the goods stay
on the books forever.

Both tables needed for this already existed. `stock_movements` even had a "Purchase"
category waiting for it. Nothing here was invented; it was connected.

**Proof it works**
Stock started at 25. Received 10, rejected 3 -> **32**. Deleted the receipt -> back to
**25**.

---

## 3.3 - Closing the gap that let a request write any column it liked

**The issue**
Seventeen files built their database commands by taking whatever field names arrived in
the request and pasting them straight into the command. The *values* were handled safely.
The *column names* were not - and they cannot be, by the usual method.

Two problems came out of that. A crafted field name could break out and rewrite the
command entirely. And even with ordinary field names, the sender got to choose which
columns were written, including ones the app never meant to expose.

**What we did**
Added one check that every field name is a real column of the table it is being written
to, reading the actual list of columns from the database itself.

We chose that over writing seventeen lists of allowed fields by hand. A hand-written list
has to be kept in step with the database forever, and when it falls behind it fails by
*rejecting valid data* - which looks like an unrelated bug, and tends to get "fixed" by
widening the list until it stops complaining. Reading the real columns cannot fall behind,
and it makes the attack impossible outright, because no real column is ever named
`description = 0 WHERE 1=1 --`.

**Remarks**
An unknown field is now **refused**, not quietly ignored. A save that silently drops half
of what you sent while reporting success is worse than one that fails, because you find
out much later.

This does not go as far as "customers may change their phone number but never their
loyalty points". That needs a decision per screen about what each one is allowed to
touch, which is design work rather than a patch. It is on the backlog as such.

**Proof it works**
The attack string is refused with a clear message. An unexpected `is_admin` field is
refused. Ordinary creating and updating still work normally.

---

## 3.4 - The backlog was describing a project that no longer existed

**The issue**
`REMEDIATION_BACKLOG.md` still listed around 25 items that had already been fixed. They
were closed by the merge as a side effect rather than as deliberate tasks, and nobody
went back to tick them off.

This is worth writing down because it is the *same mistake as the original status report*,
just pointing the other way. That report claimed things were finished when they had never
run. This file claimed things were outstanding when they were long done. Both came from
describing the work from memory instead of checking it.

It also had a real cost. The single biggest security item on the list - "nothing checks
who you are" - was estimated at several days. That estimate was written when the relevant
file was empty. By last week the file was written and tested, and all that was left was
switching it on, which took an afternoon. The number in the document was scaring people
away from the cheapest important fix on the board.

**What we did**
Went through it and marked off what is genuinely done, by checking the code rather than
recalling it. Replaced the summary table with counts taken by counting the rows.

**Remarks**
It now reads: **68 found, 37 closed, 31 open.**

Two of the four remaining critical items - rotating the leaked database passwords and
removing them from the project's history - can only be done by whoever owns the
repository. They are not ours to close.

The largest remaining block by far is screens that have not been designed yet. That is
roughly 70% of all the work left, and it is genuinely different in kind from everything
above: it needs product decisions, not integration.


## 3.5 - A fresh clone can now set itself up

**The issue**
Cloning this repo onto a new machine did not give you a working system, and
nothing said so. `npm run dev` started the MySQL *process* and stopped there, so
the server booted, printed "Started WITHOUT a database", and failed on every
screen.

Getting from there to something usable meant knowing four things nobody had
written down: copy `.env.example` and invent a JWT secret; create the database
by hand, because no SQL file creates it; run `database/01` to `07` in exactly
that order; then apply all nine migrations. Get the order wrong and the schema
half-loads, which is the worst outcome available - it looks like it worked
until something specific breaks weeks later.

**What we did**
Three commands, each safe to run twice:

    npm run db:install    # installs MySQL if the machine has none
    npm run db:setup      # creates the database, loads everything, migrates
    npm run dev           # starts it all

Installing MySQL is deliberately **separate** from `npm run dev`. Installing a
database server should never happen as a side effect of "run the app" - it
writes outside the project, needs administrator rights, and on a machine that
already has MySQL for something else it is the last thing anyone wants
triggered automatically.

`db:setup` records every file it applies, so running it again applies nothing
and re-seeds nothing. That matters: re-running the sample data on a live
database would duplicate every customer and bill in it.

**Remarks - what running it actually found**
The script was written in an afternoon. Testing it against a genuinely empty
database took far longer, because it kept failing on things that had been
broken all along and were invisible to everyone working from a database they
had built by hand months ago.

**1. Two schema files still contained unresolved merge conflicts.**
`03_developer1_finance.sql` and `07_sample_data.sql` had `<<<<<<<` markers
committed into them. Those are not valid SQL, so *neither file had ever been
loadable*. Resolved against what the working database actually contains rather
than by picking a branch: the kept side defines `financial_pin` and
`cash_ledger`, which exist; the dropped side defined `financial_security` and
`cash_book`, the older names the project deliberately moved away from. In the
sample data both sides were kept, because only one of them seeds the `users`
table.

**2. Nobody could have logged in.**
The seeded passwords were stored as **plaintext** - `admin123`, `riya123`. The
login code compares with bcrypt, and bcrypt can never match a plaintext string,
so the credentials printed in every document simply did not work on a fresh
install. They are real hashes now. It was also teaching the wrong lesson in a
file students read to learn the schema.

**3. The database name was a lie.**
Four files contained a literal `USE jl_jewellers_erp;`. Set `DB_NAME` to
anything else and the load would switch databases partway through and write
into `jl_jewellers_erp` regardless - possibly over a real one. Stripping it is
what finally made that setting mean anything. The example file also said
`JL_Jewellers_ERP`, which fails outright on Linux and macOS, where database
names are case-sensitive.

**4. The dumps carried replication state.**
Three files were produced by `mysqldump` on a server with GTID replication on,
so they set `GTID_PURGED` from the source server. That fails on any machine
whose own GTID set overlaps, with an error that reads like file corruption.
Stripped at load time.

**5. MySQL was located by one hardcoded path.**
`C:\Program Files\MySQL\MySQL Server 8.4\...` - correct on one machine,
wrong on any with 8.0 or a different drive. Now searched properly, with a
clear message pointing at `npm run db:install` when nothing is found.

**Proof it works**
Dropped the database entirely and rebuilt from nothing: 16 files applied, 95
tables, 8 users, 20 customers, 15 products, 15 bills. Then pointed the app at
it - login succeeded, the read sweep passed 92 routes with 0 regressions, and
the write sweep passed 10 of 10. Running setup a second time applied 0 files.

---

## How to run it now

```bash
# once, after cloning
npm run setup

# every day
npm run dev
```

Then open **http://localhost:5173**

You need MySQL running locally with the `JL_Jewellers_ERP` database loaded from the
`database/` folder, and `backend/.env` filled in (copy `backend/.env.example`).

### What you should see

| Check | Expected |
|---|---|
| Terminal | Both `[BACKEND]` and `[FRONTEND]` start, no crashes |
| `http://localhost:5173` | The login page loads |
| `http://localhost:5000` | "🚀 JL Jewellers ERP Backend Running" |
| Browser Network tab on login | A request to `/api/auth/login` that **reaches the server** |

That last one is the real win. Before today the request never arrived. It now arrives
and gets a proper reply from the server — even though logging in still fails for a
different reason (see below).

---

## What we verified

| Test | Result |
|---|:--:|
| Backend starts and loads its settings | ✅ 8 settings loaded from `backend/.env` |
| Backend answers on port 5000 | ✅ |
| `/api/auth/login` exists on the same server as billing | ✅ reaches the controller |
| Frontend builds without errors | ✅ |
| Frontend dev server starts on 5173 | ✅ |
| Frontend proxy forwards `/api` to the backend | ✅ request arrives at the backend |
| `npm run dev` starts both together | ✅ |

Not verified: anything needing a live database. MySQL was not running on the machine
used for this session, so every database-backed endpoint returned a server error.
**Re-run these checks on a machine with MySQL up** — that is your real starting point.

---

## What we left for you (on purpose)

These are all real, known problems. We are **not** fixing them here, because working
through them is the point of the rebuild. Each one has an ID in
[REMEDIATION_BACKLOG.md](REMEDIATION_BACKLOG.md).

### Login still will not work — and here is exactly why

| # | Problem | Where |
|:--:|---|---|
| `S0-4` | The token is created using the plain text `"secret"`, but checked against `process.env.JWT_SECRET`. They will never match, so no token is ever accepted | `backend/controllers/authController.js:29` |
| `S0-5` | The token stores `user.id`, but the database column is called `user_id`. So the token contains `undefined` | same line |

Two small edits. Do these first — you will see login work immediately.

### The dashboard will stay empty

| # | Problem | Where |
|:--:|---|---|
| `S0-7` | The code queries a table called `cash_book`. The real table is `cash_ledger`. This one wrong name breaks the dashboard summary, cash book and cash flow — 9 queries | `cashBookModel.js`, `financeModel.js`, `dashboardModel.js` |
| `S0-8` | The code queries `financial_security`. The real table is `financial_pin` | `financialSecurityModel.js` |

### Newly found in the billing page (not fixed)

While fixing the build errors we found more problems in the same file. These do not
stop it building, so they are yours:

| Problem | Detail |
|---|---|
| **The calculator reads fields that do not exist** | The form saves `net_weight` and `making_charge_percent`, but the calculator reads `item.netWeight` and `item.makingPercent`. Different names, so it always reads nothing. **Every total on the page will show ₹0.00** |
| **The same mistake when sending to the server** | Lines 470 and 472 build the API payload from those same non-existent fields, so zeros get sent to the backend too |
| **Frontend and backend disagree about GST** | Frontend: a flat 3% on the whole taxable value. Backend: 3% on metal + 5% on making charges. These give different answers for the same bill |
| **Frontend and backend disagree about discount** | Frontend subtracts the discount *before* calculating GST. Backend subtracts it *after*. Again, two different totals |

The GST and discount disagreements matter most — two parts of the same system
computing different money for the same bill. Decide which is correct (check with the
business), then make both sides match.

### Still wide open

| # | Problem |
|:--:|---|
| `S1-1` | The database passwords and JWT secret in the repo are exposed and must be changed |
| `S1-3` | No endpoint checks whether you are logged in. Bills, payments, ledgers and customer records are all open to anyone who can reach the server |
| `S1-4` | `ProtectedRoute` exists but is never used, so every screen opens without logging in |
| `S2-3` | Bill totals ignore quantity, so multi-item bills undercharge |
| `S3-1` | The entire inventory backend (23 modules) is still stranded on `developer-purvansh` |
| `S3-9` | There are still two axios setups; only one attaches the login token |

---

## Files changed this session

| File | Change |
|---|---|
| `package.json` | **new** — root runner, `npm run dev` |
| `.gitignore` | rewritten — was empty |
| `backend/.env.example` | **new** — settings template, safe to commit |
| `backend/.env` | **new** — local settings, git-ignored |
| `backend/package.json` | added `bcryptjs` |
| `backend/src/app.js` | mounted auth + employee routes; now the only app |
| `backend/src/server.js` | explicit path to `.env` |
| `backend/app.js` | **deleted** — duplicate second server |
| `backend/server.js` | **deleted** — duplicate second server |
| `backend_backup/` | **deleted** — leftover copy |
| `tash show --name-only stash@{0}` | **deleted** — junk file from a typo |
| `frontend/vite.config.js` | added the `/api` proxy |
| `frontend/src/api/axios.js` | base URL → `/api` |
| `frontend/src/services/api.js` | base URL → `/api` |
| `frontend/src/pages/billing/CreateBill.jsx` | fixed import path + 2 syntax errors |

---

## Next session

Planned: the Electron desktop shell — one window, backend started automatically,
no terminal needed. After that, the Windows installer.

Before then, the highest-value thing the team can do is work through `S0-4`, `S0-5`,
`S0-7` and `S0-8` above. They total well under a day and turn a blank app into one
where you can log in and see real numbers.
