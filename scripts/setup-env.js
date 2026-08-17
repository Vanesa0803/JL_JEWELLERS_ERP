/**
 * Create backend/.env from the example, if it does not exist yet.
 *
 *     npm run env:setup
 *
 * A fresh clone has no .env — it is git-ignored, which is correct, and is
 * exactly why the leaked credentials in this project's history were such a
 * problem. But it means a clone cannot connect to anything until someone
 * copies the example by hand and invents a JWT secret, and nothing told them
 * that. The server just started and reported no database.
 *
 * The logic lives in lib/env-file.js so that db:setup and db:install can call
 * it directly rather than printing "now go and run env:setup".
 *
 * This never overwrites an existing .env.
 */

const { ensureEnvFile, passwordIsUnset } = require("./lib/env-file");

const log = (msg) => console.log(`[env] ${msg}`);

try {
  ensureEnvFile({ log });

  if (passwordIsUnset()) {
    console.log("");
    log("DB_PASSWORD is not set yet. Either:");
    log('  - run "npm run db:install"  (sets it for you on a new MySQL), or');
    log("  - edit backend/.env yourself if you already have MySQL running.");
  }
} catch (error) {
  log(error.message);
  process.exit(1);
}
