/**
 * ESM view of the shared database module.
 *
 * The real implementation lives in db.cjs — see the comment at the top of that
 * file for why. This shim exists so already-ESM code can keep its natural
 * imports:
 *
 *     import { pool } from "../config/db.js";     // promise API
 *     import db from "../config/db.js";           // callback pool
 *
 * `pool` is deliberately the PROMISE pool, because the ESM code in this project
 * is written with async/await against `pool.execute(...)`.
 */

import database from "./db.cjs";

/** Promise-style pool — `await pool.execute(sql, params)` */
export const pool = database.promisePool;

/** Callback-style pool — `pool.query(sql, params, cb)` */
export const callbackPool = database.pool;

/** Runs a real query to confirm the database is reachable. */
export const verifyConnection = database.verifyConnection;

/**
 * Kept for compatibility with code written against Purvansh's original db.js,
 * which exported `connectDB`. Same job as verifyConnection.
 */
export const connectDB = database.verifyConnection;

export default database.pool;
