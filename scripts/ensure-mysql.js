/**
 * ensure-mysql.js
 *
 * Makes sure MySQL is running before the app starts.
 *
 * It checks whether anything is listening on the database port. If yes, it does
 * nothing at all. If no, it starts mysqld in the background and waits until the
 * port answers.
 *
 * This runs automatically as part of `npm run dev`, so nobody has to remember to
 * start the database first.
 *
 * If MySQL is installed somewhere else on your machine, set MYSQLD_PATH and
 * MYSQL_DATADIR in your environment and this will use those instead.
 */

const net = require("net");
const { spawn } = require("child_process");
const fs = require("fs");
const { findMysqld, findDataDir } = require("./lib/find-mysql");

const PORT = Number(process.env.DB_PORT) || 3306;
const HOST = "127.0.0.1";

/*
 * Located rather than hardcoded.
 *
 * These used to be literal paths to MySQL 8.4 under Program Files, which is
 * correct on exactly one machine. lib/find-mysql.js checks MYSQLD_PATH, then
 * PATH, then the usual install directories newest-version-first — so an 8.0
 * install, a different drive, or a package-manager install all work without
 * anyone editing this file.
 */
const MYSQLD = findMysqld();
const DATADIR = findDataDir();

const WAIT_TIMEOUT_MS = 60000;
const POLL_INTERVAL_MS = 500;

/** Resolves true if something is listening on the port. */
function isPortOpen() {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    const done = (result) => {
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(1000);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));

    socket.connect(PORT, HOST);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  if (await isPortOpen()) {
    console.log(`[db] MySQL already running on ${HOST}:${PORT}`);
    return;
  }

  console.log(`[db] MySQL is not running. Starting it...`);

  if (!MYSQLD) {
    console.error(`[db] No MySQL installation found on this machine.`);
    console.error(`[db]`);
    console.error(`[db]     Install it with:  npm run db:install`);
    console.error(`[db]`);
    console.error(`[db] If MySQL IS installed somewhere unusual, set MYSQLD_PATH`);
    console.error(`[db] to the full path of mysqld and try again.`);
    process.exit(1);
  }

  if (!DATADIR || !fs.existsSync(DATADIR)) {
    console.error(`[db] Found mysqld at:\n      ${MYSQLD}`);
    console.error(`[db] ...but could not find its data directory.`);
    console.error(`[db] Set MYSQL_DATADIR to the correct location.`);
    process.exit(1);
  }

  // detached + unref so MySQL keeps running after this script exits.
  //
  // Caveat, tested on Windows: this survives a normal exit, but a forced kill of
  // the whole process tree (e.g. `taskkill /T /F`, or closing the terminal window
  // outright) can still take MySQL down with it. If that happens, just run
  // `npm run db` again — or install the Windows service via
  // scripts/setup-mysql-service.ps1, which is genuinely independent of the app.
  const child = spawn(MYSQLD, [`--datadir=${DATADIR}`], {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });

  child.unref();

  const deadline = Date.now() + WAIT_TIMEOUT_MS;

  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);

    if (await isPortOpen()) {
      console.log(`[db] MySQL is up on ${HOST}:${PORT}`);
      return;
    }
  }

  console.error(
    `[db] MySQL did not start within ${WAIT_TIMEOUT_MS / 1000}s. Start it manually and try again.`
  );
  process.exit(1);
}

main().catch((error) => {
  console.error("[db] Unexpected error:", error.message);
  process.exit(1);
});
