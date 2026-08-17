/**
 * Create the database, load the schema and sample data, and apply every
 * migration. Safe to run repeatedly.
 *
 *     npm run db:setup
 *
 * WHAT A FRESH CLONE USED TO NEED
 * -------------------------------
 * Nothing did any of this. `npm run dev` started the MySQL *process* and
 * stopped there, so a clone booted the server, printed "Started WITHOUT a
 * database", and failed on every data call. Getting from there to a working
 * system meant knowing, without being told:
 *
 *   - create the database by hand (no .sql file creates it)
 *   - run database/01..07 in numeric order (05 is foreign keys and fails if
 *     the tables from 01-04 are not there yet)
 *   - then apply all the migrations in database/migrations, also in order
 *
 * Getting the order wrong half-loads the schema, which is the worst outcome
 * available: it looks like it worked until something specific breaks later.
 *
 * IDEMPOTENCE
 * -----------
 * Every file that runs is recorded in a `schema_history` table, so a second
 * run applies nothing and re-seeds nothing. That matters more than it sounds:
 * re-running 07_sample_data on a live database would duplicate every customer
 * and bill in it.
 *
 * Use --force to re-run files that are already recorded. It does NOT drop
 * anything; it just ignores the history.
 */

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const ROOT = path.resolve(__dirname, "..");
require("dotenv").config({ path: path.join(ROOT, "backend", ".env") });

const DB_NAME = process.env.DB_NAME || "jl_jewellers_erp";
const FORCE = process.argv.includes("--force");

const connection = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
};

const log = (msg) => console.log(`[db] ${msg}`);

/**
 * Strip the replication bookkeeping mysqldump writes into its output.
 *
 * Three of these files were produced by `mysqldump` on a server with GTID
 * replication enabled, so they carry the source server's replication state:
 *
 *     SET @@GLOBAL.GTID_PURGED='fd7782d1-880b-11f1-...:1-87';
 *     SET @@SESSION.SQL_LOG_BIN = 0;
 *
 * Both are actively harmful here:
 *
 *   - GTID_PURGED fails outright on any server whose own GTID set overlaps,
 *     with the memorable error "the added gtid set must not overlap with
 *     @@GLOBAL.GTID_EXECUTED". That is not a corrupt file or a bad password,
 *     but it reads like one, and it stops the very first schema file dead.
 *   - SQL_LOG_BIN needs SUPER (or SYSTEM_VARIABLES_ADMIN). Fine for root,
 *     denied for the restricted user a sensible setup would use.
 *
 * Neither has anything to do with the schema. They describe where the dump
 * came from, not what it contains.
 *
 * The tidier long-term fix is to re-dump with `--set-gtid-purged=OFF`, but
 * that means regenerating files that are the project's schema of record.
 * Stripping at load time is reversible and touches nothing on disk.
 */
const sanitize = (sql) =>
  sql
    .replace(/^\s*SET\s+@@GLOBAL\.GTID_PURGED\s*=.*?;\s*$/gim, "")
    .replace(/^\s*SET\s+@@SESSION\.SQL_LOG_BIN\s*=.*?;\s*$/gim, "")
    .replace(/^\s*SET\s+@MYSQLDUMP_TEMP_LOG_BIN\s*=.*?;\s*$/gim, "")
    /*
     * Strip `USE some_database;`.
     *
     * Four of these files contain a literal `USE jl_jewellers_erp;`. The
     * connection has already selected the right database, so at best this is
     * redundant — and at worst it is silently destructive: set DB_NAME to
     * anything else and the load switches to jl_jewellers_erp partway through
     * and writes the schema and sample data into a database you did not ask
     * for, quite possibly overwriting a real one.
     *
     * It also broke this script's own bookkeeping, which is how it was found:
     * schema_history lives in the target database, and after a USE it was
     * being looked for in the other one.
     *
     * Removing it is what actually makes DB_NAME mean something.
     */
    .replace(/^\s*USE\s+[`"']?\w+[`"']?\s*;\s*$/gim, "");

/**
 * Errors that mean "this already exists", which during setup is success.
 *
 * 05_foreign_keys.sql adds constraints that several of the mysqldump files in
 * 01-04 have already created, so it fails on the first duplicate — and because
 * the whole file runs as one statement, everything after that point is lost
 * too. The same applies to re-running sample data.
 *
 * These are tolerated ONLY on a per-statement retry, and the number skipped is
 * reported rather than swallowed. Anything not on this list still fails hard:
 * a syntax error or a missing table must never be quietly ignored, or the
 * database ends up half-built while the script claims success — which is the
 * single worst outcome here, because it looks fine until something specific
 * breaks much later.
 */
const TOLERABLE = new Set([
  "ER_FK_DUP_NAME",        // foreign key constraint already exists
  "ER_DUP_KEYNAME",        // index already exists
  "ER_DUP_FIELDNAME",      // column already exists
  "ER_TABLE_EXISTS_ERROR", // table already exists
  "ER_DUP_ENTRY",          // row already seeded
]);

/**
 * Split SQL into statements on semicolons, ignoring those inside quotes or
 * comments. Needed because the data files contain semicolons inside string
 * values, and a naive split on ";" would cut statements in half.
 */
const splitStatements = (sql) => {
  const statements = [];
  let current = "";
  let quote = null;
  let lineComment = false;
  let blockComment = false;

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    const next = sql[i + 1];

    if (lineComment) {
      current += ch;
      if (ch === "\n") lineComment = false;
      continue;
    }

    if (blockComment) {
      current += ch;
      if (ch === "*" && next === "/") {
        current += next;
        i++;
        blockComment = false;
      }
      continue;
    }

    if (quote) {
      current += ch;
      if (ch === "\\") {
        // Escaped character — take the next one verbatim.
        if (next !== undefined) {
          current += next;
          i++;
        }
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === "'" || ch === '"' || ch === "`") {
      quote = ch;
      current += ch;
      continue;
    }

    if (ch === "-" && next === "-") { lineComment = true; current += ch; continue; }
    if (ch === "#") { lineComment = true; current += ch; continue; }
    if (ch === "/" && next === "*") { blockComment = true; current += ch; continue; }

    if (ch === ";") {
      if (current.trim()) statements.push(current.trim());
      current = "";
      continue;
    }

    current += ch;
  }

  if (current.trim()) statements.push(current.trim());
  return statements;
};

/** The base schema files, in the order they must run. */
const schemaFiles = () =>
  fs
    .readdirSync(path.join(ROOT, "database"))
    .filter((f) => f.endsWith(".sql"))
    .sort()
    .map((f) => ({ label: `database/${f}`, file: path.join(ROOT, "database", f) }));

/** Migrations, in date order. */
const migrationFiles = () => {
  const dir = path.join(ROOT, "database", "migrations");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort()
    .map((f) => ({ label: `migrations/${f}`, file: path.join(dir, f) }));
};

const main = async () => {
  if (!fs.existsSync(path.join(ROOT, "backend", ".env"))) {
    log("backend/.env does not exist. Run: npm run env:setup");
    process.exit(1);
  }

  /* ---- connect without selecting a database, so we can create it ---- */
  let root;
  try {
    root = await mysql.createConnection({ ...connection, multipleStatements: true });
  } catch (error) {
    log(`Could not connect to MySQL at ${connection.host}:${connection.port}`);
    log(`  ${error.message}`);
    console.log("");
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      log("The user or password in backend/.env is wrong. Check DB_USER / DB_PASSWORD.");
    } else {
      log('Is MySQL running? Try: npm run db');
      log('Not installed? Try:  npm run db:install');
    }
    process.exit(1);
  }

  const [existing] = await root.query(
    "SELECT schema_name FROM information_schema.schemata WHERE schema_name = ?",
    [DB_NAME]
  );

  if (existing.length === 0) {
    // utf8mb4 so names, addresses and the rupee sign survive. The default on
    // older MySQL is latin1, which mangles all three.
    await root.query(
      `CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    log(`Created database ${DB_NAME}`);
  } else {
    log(`Database ${DB_NAME} already exists`);
  }

  await root.end();

  /* ---- reconnect, now inside the database ---- */
  const db = await mysql.createConnection({
    ...connection,
    database: DB_NAME,
    multipleStatements: true,
  });

  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_history (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      filename    VARCHAR(255) NOT NULL UNIQUE,
      applied_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [rows] = await db.query("SELECT filename FROM schema_history");
  const applied = new Set(rows.map((r) => r.filename));

  const all = [...schemaFiles(), ...migrationFiles()];
  let ran = 0;
  let skipped = 0;

  for (const { label, file } of all) {
    if (applied.has(label) && !FORCE) {
      skipped++;
      continue;
    }

    const sql = sanitize(fs.readFileSync(file, "utf8")).trim();
    if (!sql) continue;

    process.stdout.write(`[db] ${label} ... `);

    let note = "";

    try {
      await db.query(sql);
    } catch (error) {
      /*
       * The file runs as one batch first, because that is fastest and keeps
       * multi-statement constructs intact. If it fails on something that just
       * means "already there", retry statement by statement so the rest of the
       * file still lands — otherwise one duplicate constraint at the top
       * silently costs you every statement below it.
       */
      if (!TOLERABLE.has(error.code)) {
        console.log("FAILED");
        console.log("");
        log(`${label} failed: ${error.message}`);
        console.log("");
        log("Nothing after this point has run. The database is part-built.");
        log(`Fix the cause, then run "npm run db:setup" again — everything that`);
        log("already succeeded is recorded and will be skipped.");
        await db.end();
        process.exit(1);
      }

      let skippedStatements = 0;

      for (const statement of splitStatements(sql)) {
        try {
          await db.query(statement);
        } catch (stepError) {
          if (TOLERABLE.has(stepError.code)) {
            skippedStatements++;
            continue;
          }

          console.log("FAILED");
          console.log("");
          log(`${label} failed: ${stepError.message}`);
          log(`  in: ${statement.slice(0, 120).replace(/\s+/g, " ")}...`);
          console.log("");
          log("The database is part-built. Fix the cause and run this again.");
          await db.end();
          process.exit(1);
        }
      }

      note = ` (${skippedStatements} already present)`;
    }

    await db.query(
      "INSERT INTO schema_history (filename) VALUES (?) ON DUPLICATE KEY UPDATE applied_at = CURRENT_TIMESTAMP",
      [label]
    );

    console.log(`ok${note}`);
    ran++;
  }

  /* ---- report what actually landed, rather than claiming success ---- */
  const [[tables]] = await db.query(
    "SELECT COUNT(*) AS n FROM information_schema.tables WHERE table_schema = ?",
    [DB_NAME]
  );

  const counts = {};
  for (const t of ["users", "customers", "products", "bills"]) {
    try {
      const [[c]] = await db.query(`SELECT COUNT(*) AS n FROM \`${t}\``);
      counts[t] = c.n;
    } catch {
      counts[t] = "missing";
    }
  }

  await db.end();

  console.log("");
  log(`${ran} file(s) applied, ${skipped} already up to date`);
  log(`${tables.n} tables in ${DB_NAME}`);
  log(
    `users=${counts.users}  customers=${counts.customers}  ` +
      `products=${counts.products}  bills=${counts.bills}`
  );
  console.log("");

  if (counts.users === 0 || counts.users === "missing") {
    log("WARNING: no users were loaded — you will not be able to log in.");
    log('Try: npm run db:setup -- --force');
    process.exit(1);
  }

  log("Database is ready. Start the app with: npm run dev");
  log("Sign in with admin@jljewellers.com / Admin@123");
};

main().catch((error) => {
  console.error(`[db] Unexpected error: ${error.message}`);
  process.exit(1);
});
