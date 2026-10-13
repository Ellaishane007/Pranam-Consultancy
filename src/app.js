const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const env = require("./config/env");
const site = require("./config/site");
const { security, ensureUploadDirs } = require("./middleware/security");
const { isMongoReady } = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const pageRoutes = require("./routes/pages");
const apiRoutes = require("./routes/api");

ensureUploadDirs();

function createApp() {
  const app = express();
  // Register EJS explicitly so bundlers (esbuild on Netlify) include it;
  // Express otherwise loads the engine with a dynamic require it can't trace.
  app.engine("ejs", ejs.__express);
  app.set("view engine", "ejs");
  app.set("views", resolveViewsDir());
  app.use(expressLayouts);
  app.set("layout", "layouts/main");

  security(app);
  app.use(compression());
  if (env.nodeEnv !== "test") app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
  app.use(express.urlencoded({ extended: false, limit: "100kb" }));
  app.use(express.json({ limit: "100kb" }));
  app.use(
    express.static(path.join(__dirname, "public"), {
      maxAge: env.nodeEnv === "production" ? "7d" : 0
    })
  );

  app.use((req, res, next) => {
    res.locals.site = site;
    res.locals.env = env;
    res.locals.currentPath = req.path;
    res.locals.flash = req.session.flash || null;
    delete req.session.flash;
    next();
  });

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.get("/ready", (_req, res) => {
    if (env.mongoUri && !isMongoReady()) {
      res.status(503).json({ ok: false, status: "database unavailable" });
      return;
    }
    res.json({ ok: true, status: "ready" });
  });
  app.use("/", pageRoutes);
  app.use("/api", apiRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

function resolveViewsDir() {
  const candidates = [
    path.join(__dirname, "views"),
    path.join(process.env.LAMBDA_TASK_ROOT || process.cwd(), "src", "views"),
    path.join(process.cwd(), "src", "views")
  ];
  return candidates.find((dir) => fs.existsSync(path.join(dir, "layouts", "main.ejs"))) || candidates[0];
}

module.exports = { createApp };
