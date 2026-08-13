/**
 * Shared database module.
 *
 * WHY THIS FILE IS .cjs
 * ---------------------
 * The backend is mid-conversion from CommonJS to ESM. Node lets an ESM file
 * import a CommonJS one, but NOT the other way round — CommonJS cannot
 * `require()` an ESM file. Since the not-yet-converted finance models still use
 * `require`, the real database module has to stay CommonJS until they are all
 * converted. `db.js` sits alongside this as a thin ESM shim for the already-ESM
 * code.
 *
 * WHAT IT EXPORTS
 * ---------------
 *   pool          callback-style pool  — pool.query(sql, params, cb)
 *   promisePool   promise-style pool   — await promisePool.execute(sql, params)
 *   connection    TEMPORARY single connection (see below)
 *
 * Both pools are views onto the SAME underlying set of connections, so this is
 * one pool, not two. mysql2 gives you `.promise()` for free.
 *
 * ABOUT `connection` — this is a bridge and it is meant to disappear
 * ------------------------------------------------------------------
 * Four files still open transactions by calling `connection.beginTransaction()`
 * directly:
 *
 *     billModel, goldSchemeModel, customerOrderService, makerAssignmentService
 *
 * A pool has no `beginTransaction()` — a transaction must stay pinned to one
 * connection, so pooled code has to call `pool.getConnection()` first. Rather
 * than rewrite that critical bill-creation path up front, those four files are
 * patched as their own module lands (billing, schemes, orders), per the
 * merge-as-you-verify rule.
 *
 * Once all four are converted, delete `connection` below and this really is a
 * single shared pool. Tracked in MERGE_LOG.md.
 */

const path = require("node:path");
const mysql = require("mysql2");

require("dotenv").config({
  path: path.resolve(__dirname, "..", "..", ".env"),
});

const settings = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

/* ------------------------------------------------------------------ *
 * The shared pool
 * ------------------------------------------------------------------ */

const pool = mysql.createPool({
  ...settings,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

/* ------------------------------------------------------------------ *
 * TEMPORARY: dedicated connection for the four transaction sites
 * ------------------------------------------------------------------ */

const connection = mysql.createConnection(settings);

connection.connect((error) => {
  if (error) {
    console.error("Transaction connection failed:", error.code || error.message);
  }
});

/* ------------------------------------------------------------------ *
 * Startup check
 *
 * This actually runs a query. The previous version called createPool() and
 * then logged "MySQL Connected" unconditionally — createPool does no network
 * work, so that message printed even with MySQL completely stopped. A check
 * that cannot fail is worse than no check.
 * ------------------------------------------------------------------ */

const verifyConnection = async () => {
  try {
    await promisePool.query("SELECT 1");
    console.log(`MySQL connected — ${settings.database} on ${settings.host}:${settings.port}`);
    return true;
  } catch (error) {
    console.error(`MySQL connection FAILED — ${error.code || error.message}`);
    console.error(`  tried ${settings.user}@${settings.host}:${settings.port}/${settings.database}`);
    return false;
  }
};

module.exports = pool;
module.exports.pool = pool;
module.exports.promisePool = promisePool;
module.exports.connection = connection;
module.exports.verifyConnection = verifyConnection;
