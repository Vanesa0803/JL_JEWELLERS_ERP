/**
 * ensure-mysql.js
 *
 * Makes sure MySQL is running before the app starts.
 *
 * It checks whether anything is listening on the database port. If yes, it does
 * nothing at all. If no, it starts mysqld in the background and waits until the
 * port answers — initialising a data directory first if there isn't one.
 *
 * This runs automatically as part of `npm run dev`, so nobody has to remember to
 * start the database first.
 *
 * If MySQL is installed somewhere else on your machine, set MYSQLD_PATH and
 * MYSQL_DATADIR in your environment and this will use those instead.
 *
 * WHY IT ALSO INITIALISES THE DATA DIRECTORY
 * ------------------------------------------
 * It used to give up here:
 *
 *     [db] Found mysqld at: ...\bin\mysqld.exe
 *     [db] ...but could not find its data directory.
 *     [db] Set MYSQL_DATADIR to the correct location.
 *
 * On a machine where MySQL came from winget, that was unfixable advice: the
 * package installs the binaries and never creates a data directory, so there
 * was no correct location to point MYSQL_DATADIR at, and no command in the
 * project would make one. Creating a local data folder is not the same thing as
 * installing a database server, so it belongs here rather than behind a
 * separate deliberate step.
 */

const { findMysqld, findDataDir } = require("./lib/find-mysql");
const {
  ensureDataDir,
  startMysqld,
  setRootPassword,
  isPortOpen,
} = require("./lib/mysql-data");
const { ensureEnvFile, writeValue, passwordIsUnset } = require("./lib/env-file");
const crypto = require("crypto");

const PORT = Number(process.env.DB_PORT) || 3306;
const HOST = "127.0.0.1";

const log = (msg) => console.log(`[db] ${msg}`);

async function main() {
  if (await isPortOpen(PORT, HOST)) {
    log(`MySQL already running on ${HOST}:${PORT}`);
    return;
  }

  log(`MySQL is not running. Starting it...`);

  /*
   * Located rather than hardcoded. lib/find-mysql.js checks MYSQLD_PATH, then
   * PATH, then the usual install directories newest-version-first — so an 8.0
   * install, a different drive, or a package-manager install all work without
   * anyone editing this file.
   */
  const mysqld = findMysqld();

  if (!mysqld) {
    log(`No MySQL installation found on this machine.`);
    log(``);
    log(`    Install it with:  npm run db:install`);
    log(``);
    log(`If MySQL IS installed somewhere unusual, set MYSQLD_PATH`);
    log(`to the full path of mysqld and try again.`);
    process.exit(1);
  }

  log(`Found mysqld at:`);
  log(`  ${mysqld}`);

  let dataDir;
  let initialised;

  try {
    ({ dir: dataDir, initialised } = ensureDataDir({
      mysqld,
      dataDir: findDataDir(),
      log,
    }));
  } catch (error) {
    log(``);
    log(error.message);
    process.exit(1);
  }

  // detached + unref so MySQL keeps running after this script exits.
  //
  // Caveat, tested on Windows: this survives a normal exit, but a forced kill of
  // the whole process tree (e.g. `taskkill /T /F`, or closing the terminal window
  // outright) can still take MySQL down with it. If that happens, just run
  // `npm run db` again — or install the Windows service via
  // scripts/setup-mysql-service.ps1, which is genuinely independent of the app.
  const started = await startMysqld({ mysqld, dataDir, port: PORT, log });

  if (!started) {
    log(`MySQL did not start within 60s. Start it manually and try again.`);
    process.exit(1);
  }

  /*
   * A datadir we just created has an empty root password, and backend/.env has
   * a placeholder. Close both gaps now, while we still know the server is ours
   * to configure — `initialised` is false for any pre-existing MySQL, so we
   * never touch a password someone else relies on.
   */
  if (initialised) {
    const password = crypto.randomBytes(18).toString("base64url");

    await setRootPassword({ port: PORT, password, log });

    ensureEnvFile({ log: (m) => console.log(`[env] ${m}`) });
    writeValue("DB_PASSWORD", password);

    log(`DB_PASSWORD written to backend/.env — nothing to edit by hand.`);
    log(``);
    log(`Next: npm run db:setup`);
  } else if (passwordIsUnset()) {
    log(``);
    log(`Note: DB_PASSWORD in backend/.env is not set, but this MySQL already`);
    log(`existed so its password is not ours to change. Set it by hand.`);
  }
}

main().catch((error) => {
  log(`Unexpected error: ${error.message}`);
  process.exit(1);
});
