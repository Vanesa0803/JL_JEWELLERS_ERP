/**
 * Install the MySQL server, if it is not already present.
 *
 *     npm run db:install
 *
 * WHY THIS IS A SEPARATE COMMAND AND NOT PART OF `npm run dev`
 * -----------------------------------------------------------
 * Installing a database server is not something that should happen as a side
 * effect of "run the app". It writes outside the project folder, it needs
 * administrator rights, it can take several minutes, and on a machine that
 * already has MySQL for something else it is the last thing anyone wants
 * triggered automatically. So `npm run dev` still only STARTS MySQL, and
 * installing is a deliberate, separate step you run once.
 *
 * WHAT IT CAN AND CANNOT DO
 * -------------------------
 * On Windows this uses winget, which ships with Windows 11 and recent 10. That
 * covers the machines this project targets.
 *
 * Everywhere else it prints the one command to run rather than guessing. That
 * is deliberate: a wrong package manager guess on someone's Linux machine is
 * worse than a clear instruction, and macOS/Linux are not the deployment
 * target here — Windows is.
 *
 * It will not reinstall over an existing MySQL. If one is found, it says where
 * and stops.
 */

const { execFileSync, spawnSync } = require("child_process");
const { findMysqld, isWindows } = require("./lib/find-mysql");

const WINGET_PACKAGE = "Oracle.MySQL";

const log = (msg) => console.log(`[mysql] ${msg}`);

const manualInstructions = () => {
  if (process.platform === "darwin") {
    return ["Install MySQL with Homebrew:", "", "    brew install mysql", "    brew services start mysql"];
  }

  if (process.platform === "linux") {
    return [
      "Install MySQL with your distribution's package manager, e.g.:",
      "",
      "    sudo apt install mysql-server        # Debian / Ubuntu",
      "    sudo dnf install mysql-server        # Fedora / RHEL",
    ];
  }

  return ["Download the MySQL installer from https://dev.mysql.com/downloads/installer/"];
};

const hasWinget = () => {
  try {
    execFileSync("winget", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

const main = () => {
  const existing = findMysqld();

  if (existing) {
    log(`MySQL is already installed:`);
    log(`  ${existing}`);
    log(`Nothing to do. Run "npm run db:setup" to create the database.`);
    return;
  }

  log("No MySQL installation found.");

  if (!isWindows || !hasWinget()) {
    console.log("");
    if (isWindows) log("winget is not available on this machine.");
    console.log(manualInstructions().join("\n"));
    console.log("");
    log('Once it is installed, run "npm run db:setup".');
    process.exit(1);
  }

  log(`Installing ${WINGET_PACKAGE} via winget.`);
  log("This needs administrator rights and takes a few minutes.");
  log("Windows will ask you to confirm.");
  console.log("");

  /*
   * stdio: inherit so winget's own progress and its elevation prompt are
   * visible. Swallowing them would leave the user staring at a frozen terminal
   * while a UAC dialog waits behind the window.
   */
  const result = spawnSync(
    "winget",
    [
      "install",
      "--id", WINGET_PACKAGE,
      "--exact",
      "--accept-package-agreements",
      "--accept-source-agreements",
    ],
    { stdio: "inherit" }
  );

  if (result.status !== 0) {
    console.log("");
    log(`winget exited with code ${result.status}.`);
    log("If it reported that the package is already installed, that is fine.");
    console.log("");
    console.log(manualInstructions().join("\n"));
    process.exit(1);
  }

  console.log("");

  /*
   * Re-check rather than trusting the exit code. winget can report success
   * while the binary lands somewhere the locator does not look, and it is
   * better to say so now than to fail later with a confusing error.
   */
  const installed = findMysqld();

  if (!installed) {
    log("winget finished, but mysqld still cannot be found.");
    log("You may need to open a NEW terminal so PATH is refreshed.");
    log("If it is installed somewhere unusual, set MYSQLD_PATH to point at it.");
    process.exit(1);
  }

  log(`Installed: ${installed}`);
  log('Next: run "npm run db:setup" to create and populate the database.');
};

main();
