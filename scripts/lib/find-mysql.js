/**
 * Locate a MySQL installation.
 *
 * Every other script asks this module rather than hardcoding a path. The old
 * ensure-mysql.js assumed exactly one location:
 *
 *     C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe
 *
 * which is right on the machine it was written on and wrong on a machine with
 * 8.0, or an x86 install, or MySQL installed through a package manager. A
 * student cloning this repo would get "could not find mysqld" and no idea that
 * the answer is one directory over.
 *
 * Search order, most explicit first:
 *   1. MYSQLD_PATH / MYSQL_DATADIR from the environment  (always wins)
 *   2. whatever is on PATH
 *   3. the usual install directories, newest version first
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const isWindows = process.platform === "win32";
const exe = (name) => (isWindows ? `${name}.exe` : name);

/** Directories MySQL is commonly installed into, per platform. */
const searchRoots = () => {
  if (isWindows) {
    return [
      "C:\\Program Files\\MySQL",
      "C:\\Program Files (x86)\\MySQL",
      "C:\\MySQL",
      "C:\\tools\\mysql", // chocolatey
    ];
  }

  return [
    "/usr/local/mysql",
    "/usr/local/opt/mysql",
    "/opt/homebrew/opt/mysql",
    "/usr",
    "/usr/local",
  ];
};

/** Ask the OS where a binary is, if anywhere. */
const onPath = (binary) => {
  try {
    const finder = isWindows ? "where" : "which";
    const out = execFileSync(finder, [binary], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    const first = out.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)[0];
    return first && fs.existsSync(first) ? first : null;
  } catch {
    return null;
  }
};

/**
 * Every "MySQL Server X.Y" style directory under the search roots, newest
 * first, so a machine with both 8.0 and 8.4 installed picks 8.4.
 */
const versionedDirs = () => {
  const found = [];

  for (const root of searchRoots()) {
    if (!fs.existsSync(root)) continue;

    let entries;
    try {
      entries = fs.readdirSync(root, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) found.push(path.join(root, entry.name));
    }

    // The root itself may be an install (e.g. /usr with /usr/bin/mysqld).
    found.push(root);
  }

  // Sort by any version number in the name, descending.
  const versionOf = (dir) => {
    const m = dir.match(/(\d+)\.(\d+)/);
    return m ? Number(m[1]) * 1000 + Number(m[2]) : 0;
  };

  return found.sort((a, b) => versionOf(b) - versionOf(a));
};

/** Full path to mysqld, or null. */
const findMysqld = () => {
  if (process.env.MYSQLD_PATH) {
    return fs.existsSync(process.env.MYSQLD_PATH) ? process.env.MYSQLD_PATH : null;
  }

  const viaPath = onPath(exe("mysqld"));
  if (viaPath) return viaPath;

  for (const dir of versionedDirs()) {
    const candidate = path.join(dir, "bin", exe("mysqld"));
    if (fs.existsSync(candidate)) return candidate;
  }

  return null;
};

/** Full path to the mysql client, or null. Optional — nothing depends on it. */
const findMysqlClient = () => {
  const viaPath = onPath(exe("mysql"));
  if (viaPath) return viaPath;

  for (const dir of versionedDirs()) {
    const candidate = path.join(dir, "bin", exe("mysql"));
    if (fs.existsSync(candidate)) return candidate;
  }

  return null;
};

/** The data directory, or null. */
const findDataDir = () => {
  if (process.env.MYSQL_DATADIR) {
    return fs.existsSync(process.env.MYSQL_DATADIR) ? process.env.MYSQL_DATADIR : null;
  }

  const candidates = isWindows
    ? ["C:\\ProgramData\\MySQL\\data", "C:\\ProgramData\\MySQL\\MySQL Server 8.4\\Data", "C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Data"]
    : ["/usr/local/mysql/data", "/var/lib/mysql", "/opt/homebrew/var/mysql", "/usr/local/var/mysql"];

  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }

  // A datadir sitting beside the install (common for zip installs).
  for (const dir of versionedDirs()) {
    for (const name of ["data", "Data"]) {
      const candidate = path.join(dir, name);
      if (fs.existsSync(candidate)) return candidate;
    }
  }

  return null;
};

module.exports = { findMysqld, findMysqlClient, findDataDir, isWindows };
