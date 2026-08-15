/**
 * Server entry point.
 *
 * Environment loading lives inside config/db.js rather than here. In ESM,
 * `import` statements are hoisted and run before any code in this file, so
 * calling dotenv here would happen AFTER the database module had already read
 * process.env and found it empty.
 */

import app from "./app.js";
import { verifyConnection } from "./config/db.js";

const PORT = Number(process.env.PORT) || 5000;

/**
 * Bound to loopback on purpose.
 *
 * This is a single-operator desktop application — the API is only ever called
 * by the app running on this same machine. Binding to all interfaces (the Node
 * default) put the entire billing, payments and customer data on the local
 * network, reachable by any device on the same WiFi with no authentication.
 *
 * Set API_HOST=0.0.0.0 if the API ever genuinely needs to serve other machines,
 * but add authentication first (S1-3 in REMEDIATION_BACKLOG.md).
 */
const HOST = process.env.API_HOST || "127.0.0.1";

const start = async () => {
  const databaseReachable = await verifyConnection();

  app.listen(PORT, HOST, () => {
    console.log(`API listening on http://${HOST}:${PORT}`);

    if (!databaseReachable) {
      console.log("Started WITHOUT a database — every data endpoint will fail.");
    }
  });
};

start();
