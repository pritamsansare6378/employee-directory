const { app } = require("./app");
const { config } = require("./config/env");
const { pool, checkDatabaseConnection } = require("./config/db");

let server;

async function startServer() {
  try {
    await checkDatabaseConnection();
    console.log("database connected");

    server = app.listen(config.port, () => {
      console.log(`API running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Unable to start server. Check your MySQL configuration.", error);
    process.exitCode = 1;
    await pool.end().catch(() => {});
  }
}

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully...`);

  if (!server) {
    await pool.end().catch(() => {});
    process.exit(0);
  }

  server.close(async () => {
    await pool.end().catch((error) => console.error("Error closing MySQL pool:", error));
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

void startServer();
