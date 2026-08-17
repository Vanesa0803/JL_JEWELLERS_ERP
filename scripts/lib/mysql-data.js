/**
 * Initialise, start, and take ownership of a local MySQL data directory.
 *
 * WHY THIS EXISTS
 * ---------------
 * Installing MySQL and having a MySQL you can connect to are two different
 * things, and the gap between them is where a fresh clone used to die.
 *
 * The winget package (and the plain .msi it wraps) installs the *binaries* and
 * nothing else. Initialising a data directory, creating the system tables and
 * setting a root password are normally done afterwards by MySQL's separate
 * Configurator, which winget does not run. So `db:install` reported success,
 * and then every later command failed with:
 *
 *     [db] Found mysqld at: ...\bin\mysqld.exe
 *     [db] ...but could not find its data directory.
 *     [db] Set MYSQL_DATADIR to the correct location.
 *
 * which is a dead end: there was no correct location to point at, because no
 * data directory existed anywhere. Nothing in the project could create one.
 *
 * This module closes that gap. It is used by both ensure-mysql.js (automatic,
 * as part of `npm run dev`) and install-mysql.js (deliberate).
 *
 * SAFETY
 * ------
 * Everything here is conditional on the data directory being ABSENT. If a
 * datadir already exists — a real MySQL someone uses for other work — this
 * module initialises nothing and changes no password. `initialised` in the
 * return value is how callers know whether the server is theirs to configure
 * or someone else's to leave alone.
 */

const fs = require("fs");
const net = require("net");
const path = require("path");
const { spawn, spawnSync } = require("child_process");

const isWindows = process.platform === "win32";

/**
 * Where we create a data directory when none exists.
 *
 * On Windows this is the first path find-mysql.js looks for, so a directory
 * created here is found again on the next run without any env var. It is also
 * outside the repo, which matters: a datadir inside the project would end up in
 * git status, dwarf the source, and be destroyed by a clean checkout.
 */
const defaultDataDir = () => {
  if (isWindows) return "C:\\ProgramData\\MySQL\\data";
  if (process.platform === "darwin") return "/usr/local/var/mysql";
  return "/var/lib/mysql";
};

/** True if the directory exists and looks like an initialised datadir. */
const looksInitialised = (dir) =>
  Boolean(dir) && fs.existsSync(path.join(dir, "mysql"));

/** Resolves true if something is listening on the port. */
const isPortOpen = (port, host = "127.0.0.1") =>
  new Promise((resolve) => {
    const socket = new net.Socket();

    const done = (result) => {
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(1000);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));

    socket.connect(port, host);
  });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Create and initialise a data directory if there isn't one.
 *
 * Returns { dir, initialised }. `initialised` is true only when this call
 * created it — the caller uses that to decide whether setting a root password
 * is its business.
 */
const ensureDataDir = ({ mysqld, dataDir, log }) => {
  const existing = dataDir;

  if (looksInitialised(existing)) {
    return { dir: existing, initialised: false };
  }

  const target = process.env.MYSQL_DATADIR || defaultDataDir();

  if (looksInitialised(target)) {
    return { dir: target, initialised: false };
  }

  /*
   * mysqld --initialize-insecure refuses to run against a non-empty directory,
   * so a half-made datadir from an interrupted attempt has to go. Only ever a
   * directory we know is not initialised — looksInitialised() was false above.
   */
  if (fs.existsSync(target) && fs.readdirSync(target).length > 0) {
    log(`Removing an incomplete data directory: ${target}`);
    fs.rmSync(target, { recursive: true, force: true });
  }

  log(`No MySQL data directory found. Creating one at:`);
  log(`  ${target}`);
  log(`(this takes about 30 seconds)`);

  fs.mkdirSync(target, { recursive: true });

  /*
   * --initialize-insecure creates root@localhost with an EMPTY password. We
   * immediately replace it with a generated one (see setRootPassword) so the
   * empty-password window lasts seconds and only ever on loopback.
   *
   * The alternative, --initialize, prints a temporary password to stderr that
   * then has to be scraped out of the log — more moving parts, same result.
   */
  const result = spawnSync(
    mysqld,
    [`--initialize-insecure`, `--datadir=${target}`, `--console`],
    { encoding: "utf8" }
  );

  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "").trim().split("\n").slice(-6).join("\n");

    throw new Error(
      `mysqld --initialize-insecure failed (exit ${result.status}).\n\n${detail}\n\n` +
        `  If this is a permissions error, the fix is to run this once in a\n` +
        `  terminal started as Administrator. Everything after it works\n` +
        `  without elevation.`
    );
  }

  log(`Data directory initialised.`);

  return { dir: target, initialised: true };
};

/**
 * Start mysqld in the background and wait for the port to answer.
 *
 * detached + unref so the server outlives this script. See the caveat in
 * ensure-mysql.js about forced process-tree kills.
 */
const startMysqld = async ({ mysqld, dataDir, port, log, timeoutMs = 60000 }) => {
  const child = spawn(mysqld, [`--datadir=${dataDir}`, `--port=${port}`], {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });

  child.unref();

  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    await sleep(500);

    if (await isPortOpen(port)) {
      log(`MySQL is up on 127.0.0.1:${port}`);
      return true;
    }
  }

  return false;
};

/**
 * Give root a real password on a server we just initialised.
 *
 * Only ever called when ensureDataDir reported initialised: true. Running this
 * against a MySQL that already had a password would lock the owner out of
 * their own database.
 */
const setRootPassword = async ({ port, password, log }) => {
  const mysql = require("mysql2/promise");

  const connection = await mysql.createConnection({
    host: "127.0.0.1",
    port,
    user: "root",
    password: "",
  });

  try {
    await connection.query(
      `ALTER USER 'root'@'localhost' IDENTIFIED BY ${connection.escape(password)}`
    );
    await connection.query("FLUSH PRIVILEGES");
    log("Root password set.");
  } finally {
    await connection.end();
  }
};

module.exports = {
  defaultDataDir,
  looksInitialised,
  isPortOpen,
  ensureDataDir,
  startMysqld,
  setRootPassword,
};
