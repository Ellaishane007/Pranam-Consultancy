const express = require("express");
const pages = require("../controllers/pagesController");

const router = express.Router();

router.get("/", pages.home);
router.get("/about", pages.about);
router.get("/services", pages.services);
router.get("/industries", pages.industries);
router.get("/candidates", pages.candidates);
router.get("/employers", pages.employers);
router.get("/contact", pages.contact);
router.get("/careers", pages.careers);
router.get("/jobs", (_req, res) => res.redirect(301, "/careers"));
router.get("/jobs/:slug", pages.jobDetail);
router.get("/privacy", pages.privacy);
router.get("/terms", pages.terms);

module.exports = router;
