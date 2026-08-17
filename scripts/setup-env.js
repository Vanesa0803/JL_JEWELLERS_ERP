/**
 * Create backend/.env from the example, if it does not exist yet.
 *
 *     npm run env:setup      (also runs as part of npm run db:setup)
 *
 * A fresh clone has no .env — it is git-ignored, which is correct, and is
 * exactly why the leaked credentials in this project's history were such a
 * problem. But it means a clone cannot connect to anything until someone
 * copies the example by hand and invents a JWT secret, and nothing tells them
 * that. The server just starts and reports no database.
 *
 * This never overwrites an existing .env. Losing someone's working database
 * password to a setup script would be an unpleasant surprise.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..");
const ENV = path.join(ROOT, "backend", ".env");
const EXAMPLE = path.join(ROOT, "backend", ".env.example");

const log = (msg) => console.log(`[env] ${msg}`);

const main = () => {
  if (fs.existsSync(ENV)) {
    log("backend/.env already exists — left untouched.");
    return;
  }

  if (!fs.existsSync(EXAMPLE)) {
    log("backend/.env.example is missing; cannot create backend/.env.");
    process.exit(1);
  }

  let contents = fs.readFileSync(EXAMPLE, "utf8");

  /*
   * Generate a real secret rather than shipping the placeholder.
   *
   * If the placeholder survives into a running system, every install shares
   * one signing key and a token minted on any of them is valid on all of them.
   * A random one per machine costs nothing and removes that entirely.
   */
  const secret = crypto.randomBytes(48).toString("base64url");
  contents = contents.replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${secret}`);

  /*
   * The database name is NOT a free choice, despite looking like one.
   * database/*.sql contain literal `USE jl_jewellers_erp;` statements, so the
   * schema will load into that name whatever this file says. Pin it to the
   * truth instead of leaving a value that silently disagrees — the example
   * previously said JL_Jewellers_ERP, which also fails outright on Linux and
   * macOS where MySQL database names are case-sensitive.
   */
  contents = contents.replace(/^DB_NAME=.*$/m, "DB_NAME=jl_jewellers_erp");

  fs.writeFileSync(ENV, contents, "utf8");

  log("Created backend/.env from .env.example");
  log("  - JWT_SECRET generated (random, unique to this machine)");
  log("  - DB_NAME set to jl_jewellers_erp");
  console.log("");
  log("EDIT backend/.env AND SET DB_PASSWORD to your MySQL root password.");
  log("Then run: npm run db:setup");
};

main();
