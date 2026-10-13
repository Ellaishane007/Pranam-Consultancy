const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

function requiredInProduction(name) {
  if (process.env.NODE_ENV === "production" && !process.env[name]) {
    throw new Error(`${name} must be set in production`);
  }
}

requiredInProduction("SESSION_SECRET");

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  siteUrl: (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  sessionSecret: process.env.SESSION_SECRET || "dev-only-change-me",
  mongoUri: process.env.MONGODB_URI || "",
  maxResumeMb: Number(process.env.MAX_RESUME_MB) || 5,
  emailEnabled: process.env.EMAIL_ENABLED === "true"
};
