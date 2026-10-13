const express = require("express");
const fs = require("fs/promises");
const { csrfSynchronisedProtection, formLimiter } = require("../middleware/security");
const { uploadResume, validateResumeFile } = require("../config/upload");
const forms = require("../controllers/formsController");

const router = express.Router();

function protectResumeCsrf(req, res, next) {
  csrfSynchronisedProtection(req, res, (err) => {
    if (!err || !req.file) {
      next(err);
      return;
    }
    fs.unlink(req.file.path).catch((cleanupError) => {
      if (cleanupError.code !== "ENOENT") console.error("Unable to remove an unsubmitted resume.", cleanupError);
    }).finally(() => next(err));
  });
}

router.post("/contact", formLimiter, csrfSynchronisedProtection, forms.contact);
router.post("/employer-enquiry", formLimiter, csrfSynchronisedProtection, forms.employerEnquiry);
router.post(
  "/job-application",
  formLimiter,
  (req, res, next) => {
    uploadResume(req, res, (err) => {
      if (err) {
        err.status = err.status || 400;
        next(err);
        return;
      }
      next();
    });
  },
  validateResumeFile,
  protectResumeCsrf,
  forms.jobApplication
);

module.exports = router;
