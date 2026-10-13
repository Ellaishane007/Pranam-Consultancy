const { validateContact, validateCandidate, validateEmployer } = require("../validators/forms");
const storage = require("../services/storage");
const fs = require("fs/promises");

async function removeResume(file) {
  if (!file) return;
  try {
    await fs.unlink(file.path);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("Unable to remove an unsubmitted resume.", err);
    }
  }
}

function wantsJson(req) {
  return req.xhr || (req.headers.accept || "").includes("application/json") || req.path.startsWith("/api/");
}

async function contact(req, res, next) {
  try {
    const data = validateContact(req.body);
    await storage.saveContact(data);
    if (wantsJson(req)) {
      res.json({ ok: true, message: "Thank you. Your message has been received." });
      return;
    }
    req.session.flash = { type: "success", text: "Thank you. Your message has been received." };
    res.redirect("/contact");
  } catch (err) {
    next(err);
  }
}

async function jobApplication(req, res, next) {
  let saved = false;
  try {
    if (!req.file) {
      const err = new Error("Please attach your resume (PDF, DOC, or DOCX).");
      err.status = 400;
      err.details = { resume: err.message };
      throw err;
    }
    const data = validateCandidate(req.body);
    await storage.saveCandidate({
      ...data,
      resumePath: req.file.filename,
      originalFilename: req.file.originalname
    });
    saved = true;
    if (wantsJson(req)) {
      res.json({ ok: true, message: "Application received. Our team will review your profile." });
      return;
    }
    req.session.flash = { type: "success", text: "Application received. Our team will review your profile." };
    res.redirect("/candidates");
  } catch (err) {
    if (!saved) await removeResume(req.file);
    next(err);
  }
}

async function employerEnquiry(req, res, next) {
  try {
    const data = validateEmployer(req.body);
    await storage.saveEmployerEnquiry(data);
    if (wantsJson(req)) {
      res.json({ ok: true, message: "Thank you. We have received your hiring requirement." });
      return;
    }
    req.session.flash = { type: "success", text: "Thank you. We have received your hiring requirement." };
    res.redirect("/employers");
  } catch (err) {
    next(err);
  }
}

module.exports = { contact, jobApplication, employerEnquiry };
