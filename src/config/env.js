const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const nodeEnv = process.env.NODE_ENV || "development";
const production = nodeEnv === "production";
const isNetlifyFunction = Boolean(
  process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT
);

function integerSetting(name, fallback, min, max) {
  const value = process.env[name];
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return parsed;
}

const siteUrl = process.env.SITE_URL || "http://localhost:3000";
let parsedSiteUrl;
try {
  parsedSiteUrl = new URL(siteUrl);
} catch {
  throw new Error("SITE_URL must be a valid absolute URL");
}
if (production && parsedSiteUrl.protocol !== "https:") {
  throw new Error("SITE_URL must use HTTPS in production");
}
if (parsedSiteUrl.pathname !== "/" || parsedSiteUrl.search || parsedSiteUrl.hash) {
  throw new Error("SITE_URL must be an origin without a path, query, or fragment");
}

const sessionSecret = process.env.SESSION_SECRET || "dev-only-change-me";
if (production && (sessionSecret.length < 32 || /replace|change-me|example/i.test(sessionSecret))) {
  throw new Error("SESSION_SECRET must be a unique random value of at least 32 characters in production");
}

const mongoUri = process.env.MONGODB_URI || "";
if (production && !mongoUri) {
  throw new Error("MONGODB_URI must be set in production; local JSON storage is not suitable for deployment");
}

const trustProxy = process.env.TRUST_PROXY === undefined
  ? (production ? 1 : false)
  : integerSetting("TRUST_PROXY", 0, 0, 10);

module.exports = {
  nodeEnv,
  port: integerSetting("PORT", 3000, 1, 65535),
  siteUrl: parsedSiteUrl.toString().replace(/\/$/, ""),
  sessionSecret,
  mongoUri,
  trustProxy,
  maxResumeMb: integerSetting("MAX_RESUME_MB", 5, 1, 50),
  resumeUploadDir: isNetlifyFunction
    ? path.posix.join("/tmp", "pranam-consultancy", "resumes")
    : path.join(__dirname, "../../uploads/resumes")
};
