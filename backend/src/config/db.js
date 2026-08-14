/**
 * Shared database connection.
 *
 * ONE mysql2 pool, exposed through both APIs:
 *
 *   pool          promise style  — await pool.execute(sql, params)
 *   callbackPool  callback style — pool.query(sql, params, cb)
 *
 * Both are views onto the same set of connections, so this really is one pool.
 * mysql2 gives you `.promise()` for free, which is what let two codebases
 * written in different styles share a single pool without either being
 * rewritten.
 *
 * HISTORY — worth knowing why this file looks the way it does
 * -----------------------------------------------------------
 * During the merge this was split in two: a `db.cjs` holding the real
 * implementation, and an ESM shim over it. That was necessary because
 * CommonJS cannot `require()` an ESM module, and half the backend was still
 * CommonJS. With every module converted, the split has been collapsed back
 * into this single file.
 *
 * It also carried a second, dedicated `connection` purely so that code calling
 * `connection.beginTransaction()` kept working — a pool has no such method,
 * since a transaction must stay pinned to one connection. All ten transaction
 * sites now take their own connection from the pool via
 * `utils/withTransaction.js`, so that second connection is gone too.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

import mysql from "mysql2";
import dotenv from "dotenv";

const here = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(here, "..", "..", ".env") });

const settings = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const callbackPool = mysql.createPool({
  ...settings,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const pool = callbackPool.promise();

/**
 * Confirms the database is actually reachable by running a query.
 *
 * This matters more than it looks. The original code called `createPool()` and
 * then logged "MySQL Connected ✅" unconditionally — but createPool does no
 * network work at all, so that message printed even with MySQL stopped. The
 * team had a permanent green light on a database that might not be running,
 * which is a large part of why three non-existent table names survived for
 * weeks. A check that cannot fail is worse than no check.
 */
const verifyConnection = async () => {
  try {
    await pool.query("SELECT 1");
    console.log(
      `MySQL connected — ${settings.database} on ${settings.host}:${settings.port}`
    );
    return true;
  } catch (error) {
    console.error(`MySQL connection FAILED — ${error.code || error.message}`);
    console.error(
      `  tried ${settings.user}@${settings.host}:${settings.port}/${settings.database}`
    );
    return false;
  }
};

export { pool, callbackPool, verifyConnection };

/** Alias kept for modules written against Purvansh's original db.js. */
export const connectDB = verifyConnection;

/**
 * Default export is the CALLBACK pool.
 *
 * Most models were written as `db.query(sql, params, cb)`, so importing the
 * default gives them exactly what they expect.
 */
export default callbackPool;
