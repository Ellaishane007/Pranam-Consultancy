const { createApp } = require("./app");
const env = require("./config/env");
const { connectDb } = require("./config/db");
const mongoose = require("mongoose");

async function start() {
  await connectDb();
  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`${require("./config/site").shortName} listening on port ${env.port} (${env.nodeEnv}).`);
  });
  server.on("error", (err) => {
    console.error("HTTP server failed to start.", err);
    process.exitCode = 1;
  });

  let shuttingDown = false;
  const shutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`${signal} received; shutting down gracefully.`);
    server.close((err) => {
      if (err) {
        console.error("HTTP server shutdown failed.", err);
        process.exitCode = 1;
      }
      mongoose.disconnect().catch((disconnectError) => {
        console.error("MongoDB shutdown failed.", disconnectError);
        process.exitCode = 1;
      });
    });
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
