const mongoose = require("mongoose");
const env = require("./env");

async function connectDb() {
  if (!env.mongoUri) {
    console.log("MongoDB URI not set — using local JSON storage for form submissions.");
    return { mode: "json" };
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
  console.log("Connected to MongoDB.");
  return { mode: "mongo" };
}

function isMongoReady() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDb, isMongoReady };
