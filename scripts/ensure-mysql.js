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

const PORT = Number(process.env.DB_PORT) || 3306;
const HOST = "127.0.0.1";

const MYSQLD =
  process.env.MYSQLD_PATH ||
  "C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\mysqld.exe";

const DATADIR =
  process.env.MYSQL_DATADIR || "C:\\ProgramData\\MySQL\\data";

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

  if (!fs.existsSync(MYSQLD)) {
    console.error(`[db] Could not find mysqld at:\n      ${MYSQLD}`);
    console.error(
      `[db] Set MYSQLD_PATH to the correct location, or start MySQL yourself.`
    );
    process.exit(1);
  }

  if (!fs.existsSync(DATADIR)) {
    console.error(`[db] Could not find the MySQL data directory at:\n      ${DATADIR}`);
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
