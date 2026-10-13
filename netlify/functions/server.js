const serverless = require("serverless-http");
const { createApp } = require("../../src/app");
const { connectDb } = require("../../src/config/db");

const app = createApp();
const handleRequest = serverless(app, { basePath: "/.netlify/functions/server" });
let databaseConnection;

exports.handler = async (event, context) => {
  databaseConnection ||= connectDb();
  await databaseConnection;
  return handleRequest(event, context);
};
