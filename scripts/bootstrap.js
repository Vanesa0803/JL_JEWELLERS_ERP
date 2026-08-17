/**
 * One command to take a fresh clone to a running system.
 *
 *     npm run bootstrap
 *
 * WHY
 * ---
 * The individual steps were each re-runnable and each printed the next command
 * to type — but there were four of them, in an order you had to already know,
 * and getting it wrong sent you somewhere unhelpful. A real run on a clean
 * Windows machine went:
 *
 *     npm install          -> not enough; the sub-projects are separate
 *     npm run dev          -> no MySQL installed
 *     npm run db:install   -> installed binaries, no data directory
 *     npm run dev          -> "could not find its data directory"  (dead end)
 *     npm run db:setup     -> "backend/.env does not exist"
 *     npm run env:setup    -> "now edit DB_PASSWORD by hand"
 *     npm run db:setup     -> could not connect
 *     npm run db           -> dead end again
 *
 * Eight commands, two of them dead ends. Every individual message was accurate;
 * the sequence was the problem. This runs the whole thing in the right order and
 * stops at the first genuine blocker.
 *
 * Each step is still available on its own, and every one is idempotent, so
 * running this on a machine that is already set up does nothing but confirm it.
 */

const { spawnSync } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const isWindows = process.platform === "win32";

const say = (msg) => console.log(msg);

const heading = (n, total, title) => {
  console.log("");
  console.log(`━━ ${n}/${total}  ${title} ${"━".repeat(Math.max(0, 46 - title.length))}`);
  console.log("");
};

/** Run a command, inheriting stdio. Returns true on exit code 0. */
const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    cwd: options.cwd || ROOT,
    shell: Boolean(options.shell),
  });

  return result.status === 0;
};

// npm is a shell script on Windows, so it needs a shell to be found at all.
const npm = (args, options = {}) => run("npm", args, { ...options, shell: isWindows });

/*
 * node is launched WITHOUT a shell, deliberately.
 *
 * process.execPath is usually "C:\Program Files\nodejs\node.exe", and under
 * shell: true cmd.exe splits it at the space and reports
 * "'C:\Program' is not recognized as an internal or external command".
 * Without a shell the path is passed as a single argument and the space is
 * simply not special.
 */
const node = (script) => run(process.execPath, [path.join(__dirname, script)]);

const fail = (message, hint) => {
  console.log("");
  say(`✗ ${message}`);
  if (hint) {
    console.log("");
    say(hint);
  }
  console.log("");
  process.exit(1);
};

const main = () => {
  const TOTAL = 4;

  say("");
  say("JL Jewellers ERP — setting up a fresh clone.");
  say("Every step below is safe to re-run.");

  /* -------------------------------------------------------------- 1. deps */
  heading(1, TOTAL, "Installing dependencies");

  // Three separate package.json files: root, backend/, frontend/. A single
  // `npm install` at the root covers only the first, which is why a clone
  // appeared to install fine and then could not start either server.
  for (const dir of [".", "backend", "frontend"]) {
    say(`[deps] ${dir === "." ? "root" : dir}`);

    if (!npm(["install", "--no-fund", "--no-audit"], { cwd: path.join(ROOT, dir) })) {
      fail(`npm install failed in ${dir}/`);
    }
  }

  /* --------------------------------------------------------------- 2. env */
  heading(2, TOTAL, "Creating backend/.env");

  if (!node("setup-env.js")) fail("Could not create backend/.env");

  /* ------------------------------------------------------------- 3. mysql */
  heading(3, TOTAL, "Making sure MySQL is running");

  /*
   * ensure-mysql handles the case that used to be a dead end: mysqld present
   * but no data directory. It only fails outright when MySQL is not installed
   * at all, which needs a deliberate, elevated install — see the hint below.
   */
  if (!node("ensure-mysql.js")) {
    fail(
      "MySQL is not available.",
      "Install it once with:\n\n    npm run db:install\n\n" +
        "That needs administrator rights and takes a few minutes.\n" +
        "Then run `npm run bootstrap` again."
    );
  }

  /* ------------------------------------------------------------ 4. schema */
  heading(4, TOTAL, "Creating the database and loading the schema");

  if (!node("setup-db.js")) fail("Database setup failed — see the error above.");

  /* ----------------------------------------------------------------- done */
  console.log("");
  say("━".repeat(52));
  say("");
  say("  Ready. Start the app with:");
  say("");
  say("      npm run dev");
  say("");
  say("  Then open http://localhost:5173 and sign in with:");
  say("");
  say("      admin@jljewellers.com / Admin@123");
  say("");
  say("━".repeat(52));
  console.log("");
};

main();
