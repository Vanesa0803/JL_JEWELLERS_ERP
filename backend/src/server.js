import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";

const DEFAULT_PORT = Number(process.env.PORT) || 3000;
const MAX_PORT_TRIES = 5;

const startServer = (port, attempts = 0) => {
  const server = app.listen(port, () => {
    console.log(`Server is running at port : ${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && attempts < MAX_PORT_TRIES) {
      console.warn(
        `Port ${port} is already in use. Trying port ${port + 1}...`,
      );
      startServer(port + 1, attempts + 1);
    } else if (error.code === "EADDRINUSE") {
      console.error(
        `Ports ${DEFAULT_PORT}-${port} are unavailable. Set a different PORT in your environment or stop the process using one of these ports.`,
      );
      process.exit(1);
    } else {
      console.error("Server Error:", error);
      process.exit(1);
    }
  });
};

connectDB()
  .then(() => {
    startServer(DEFAULT_PORT);
  })
  .catch((err) => {
    console.error("MySQL connection failed!", err);
    process.exit(1);
  });
