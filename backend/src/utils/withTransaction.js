import { callbackPool } from "../config/db.js";

/**
 * Runs work inside a database transaction on a single pooled connection.
 *
 * A transaction has to stay pinned to one connection, so it cannot run on the
 * pool directly — `pool.beginTransaction` does not exist. This takes one
 * connection out of the pool, starts the transaction, hands the connection to
 * the caller, and guarantees the connection is returned on every exit path.
 *
 * Written because the same twenty lines of getConnection / release / rollback
 * boilerplate were being repeated at every transaction site, and each copy was
 * a chance to forget a `release()` — which leaks a connection permanently and
 * eventually hangs the whole app once the pool is exhausted.
 *
 * Usage:
 *
 *     const createThing = (data) =>
 *         withTransaction(async (db, resolve, reject) => {
 *             try {
 *                 const id = await model.insert(db, data);
 *                 db.commit((err) =>
 *                     err ? db.rollback(() => reject(err)) : resolve(id)
 *                 );
 *             } catch (error) {
 *                 db.rollback(() => reject(error));
 *             }
 *         });
 *
 * `resolve` and `reject` release the connection for you, and are safe to call
 * more than once — only the first call takes effect.
 */
export const withTransaction = (run) =>
  new Promise((outerResolve, outerReject) => {
    callbackPool.getConnection((connectionError, connection) => {
      if (connectionError) {
        return outerReject(connectionError);
      }

      let finished = false;

      const finish = (settle) => (value) => {
        if (finished) return;
        finished = true;
        connection.release();
        settle(value);
      };

      const resolve = finish(outerResolve);
      const reject = finish(outerReject);

      connection.beginTransaction((transactionError) => {
        if (transactionError) {
          return reject(transactionError);
        }

        try {
          run(connection, resolve, reject);
        } catch (error) {
          connection.rollback(() => reject(error));
        }
      });
    });
  });

export default withTransaction;
