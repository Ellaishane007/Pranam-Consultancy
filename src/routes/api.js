const express = require("express");
const { csrfSynchronisedProtection, formLimiter } = require("../middleware/security");
const { uploadResume } = require("../config/upload");
const forms = require("../controllers/formsController");

const router = express.Router();

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
  csrfSynchronisedProtection,
  forms.jobApplication
);

module.exports = router;
