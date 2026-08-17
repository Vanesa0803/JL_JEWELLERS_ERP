/**
 * Create and edit backend/.env.
 *
 * Split out of setup-env.js so that other scripts can call it instead of
 * telling the user to go and run something else. The old flow had a step that
 * knew exactly what was wrong and what would fix it, and then stopped:
 *
 *     [db] backend/.env does not exist. Run: npm run env:setup
 *
 * If a script can name the command that fixes the problem, it can run it.
 *
 * Nothing here overwrites a value a human has set. Losing someone's working
 * database password to a setup script would be an unpleasant surprise.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..", "..");
const ENV_PATH = path.join(ROOT, "backend", ".env");
const EXAMPLE_PATH = path.join(ROOT, "backend", ".env.example");

/** Replace `KEY=...` in place, or append it if the key is absent. */
const setValue = (contents, key, value) => {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");

  if (pattern.test(contents)) return contents.replace(pattern, line);

  return `${contents.replace(/\s*$/, "")}\n${line}\n`;
};

/** Read a single value out of backend/.env without loading it into process.env. */
const readValue = (key) => {
  if (!fs.existsSync(ENV_PATH)) return null;

  const match = fs
    .readFileSync(ENV_PATH, "utf8")
    .match(new RegExp(`^${key}=(.*)$`, "m"));

  return match ? match[1].trim() : null;
};

/** Write a single value into backend/.env, creating nothing. */
const writeValue = (key, value) => {
  if (!fs.existsSync(ENV_PATH)) {
    throw new Error("backend/.env does not exist yet.");
  }

  const updated = setValue(fs.readFileSync(ENV_PATH, "utf8"), key, value);
  fs.writeFileSync(ENV_PATH, updated, "utf8");
};

/**
 * Create backend/.env from the example if it does not exist.
 *
 * Returns { created } so callers can stay quiet when there was nothing to do.
 */
const ensureEnvFile = ({ log }) => {
  if (fs.existsSync(ENV_PATH)) {
    log("backend/.env already exists — left untouched.");
    return { created: false };
  }

  if (!fs.existsSync(EXAMPLE_PATH)) {
    throw new Error("backend/.env.example is missing; cannot create backend/.env.");
  }

  let contents = fs.readFileSync(EXAMPLE_PATH, "utf8");

  /*
   * Generate a real secret rather than shipping the placeholder.
   *
   * If the placeholder survives into a running system, every install shares one
   * signing key and a token minted on any of them is valid on all of them.
   */
  contents = setValue(contents, "JWT_SECRET", crypto.randomBytes(48).toString("base64url"));

  /*
   * The database name is NOT a free choice, despite looking like one. The files
   * in database/ contain literal `USE jl_jewellers_erp;`, and on Linux and macOS
   * MySQL database names are case-sensitive, so the old JL_Jewellers_ERP failed
   * outright there.
   */
  contents = setValue(contents, "DB_NAME", "jl_jewellers_erp");

  fs.writeFileSync(ENV_PATH, contents, "utf8");

  log("Created backend/.env from .env.example");
  log("  - JWT_SECRET generated (random, unique to this machine)");
  log("  - DB_NAME set to jl_jewellers_erp");

  return { created: true };
};

/** True when DB_PASSWORD is absent or still the example placeholder. */
const passwordIsUnset = () => {
  const current = readValue("DB_PASSWORD");
  return current === null || current === "" || /your_mysql_password_here/i.test(current);
};

module.exports = {
  ENV_PATH,
  EXAMPLE_PATH,
  ensureEnvFile,
  readValue,
  writeValue,
  passwordIsUnset,
};
