function notFound(_req, res) {
  res.status(404).render("pages/error", {
    title: "Page not found",
    status: 404,
    message: "The page you were looking for is not available."
  });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    err.status = 400;
    err.message = "The resume file is too large.";
  }

  const status = err.status || 500;
  const isForm = req.path.startsWith("/api/");

  if (isForm) {
    res.status(status).json({
      ok: false,
      message: status === 500 ? "Something went wrong. Please try again." : err.message,
      errors: err.details || undefined
    });
    return;
  }

  if (envIsDev()) {
    console.error(err);
  }

  res.status(status).render("pages/error", {
    title: status === 404 ? "Not found" : "Error",
    status,
    message: status === 500 ? "Something went wrong. Please try again later." : err.message
  });
}

function envIsDev() {
  return (process.env.NODE_ENV || "development") !== "production";
}

module.exports = { notFound, errorHandler };
