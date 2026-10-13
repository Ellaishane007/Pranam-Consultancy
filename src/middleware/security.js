const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { csrfSync } = require("csrf-sync");
const env = require("../config/env");

const { csrfSynchronisedProtection, generateToken } = csrfSync({
  getTokenFromRequest: (req) => req.body._csrf || req.headers["x-csrf-token"]
});

function security(app) {
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "img-src": ["'self'", "data:", "https://images.unsplash.com", "https://maps.gstatic.com", "https://*.googleapis.com"],
          "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          "font-src": ["'self'", "https://fonts.gstatic.com"],
          "script-src": ["'self'"],
          "frame-src": ["'self'", "https://www.google.com", "https://maps.google.com"],
          "connect-src": ["'self'"]
        }
      }
    })
  );
  app.use(cookieParser());
  app.use(
    session({
      name: "pranam.sid",
      secret: env.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: env.nodeEnv === "production",
        maxAge: 1000 * 60 * 60 * 8
      }
    })
  );

  app.use((req, res, next) => {
    if (req.method === "GET") {
      res.locals.csrfToken = generateToken(req);
    }
    next();
  });
}

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Too many submissions. Please try again later." }
});

function ensureUploadDirs() {
  fs.mkdirSync(path.join(__dirname, "../../uploads/resumes"), { recursive: true });
}

module.exports = {
  security,
  csrfSynchronisedProtection,
  formLimiter,
  ensureUploadDirs
};
