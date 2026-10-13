const { createApp } = require("./app");
const env = require("./config/env");
const { connectDb } = require("./config/db");

async function start() {
  await connectDb();
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`${require("./config/site").shortName} running at http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
