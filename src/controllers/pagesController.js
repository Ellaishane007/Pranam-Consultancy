const site = require("../config/site");
const env = require("../config/env");
const { allJobs, findJob, filterJobs, jobFilters } = require("../services/jobsService");

function pageMeta(path, title, description) {
  return {
    path,
    title,
    description,
    canonical: `${env.siteUrl}${path === "/" ? "" : path}`
  };
}

function home(_req, res) {
  res.render("pages/home", {
    ...pageMeta(
      "/",
      "PRANAM Consultancy Service | HR & Manpower Consulting Mumbai",
      "PRANAM Consultancy Service provides staffing, recruitment, payroll, compliance and manpower consulting solutions from Mumbai, India."
    ),
    featuredJobs: allJobs().slice(0, 3)
  });
}

function about(_req, res) {
  res.render("pages/about", {
    ...pageMeta(
      "/about",
      `About Us | ${site.shortName}`,
      `${site.legalName} is an HR and manpower consulting firm based in ${site.officeArea}, ${site.city}, founded around ${site.foundedYear} by ${site.founder} and ${site.coFounder}.`
    )
  });
}

function services(_req, res) {
  res.render("pages/services", {
    ...pageMeta(
      "/services",
      `HR & Workforce Solutions | ${site.shortName}`,
      "Permanent staffing, temporary staffing, payroll and compliance, RPO, and manpower consulting from Mumbai."
    )
  });
}

function industries(_req, res) {
  res.render("pages/industries", {
    ...pageMeta(
      "/industries",
      `Industries | ${site.shortName}`,
      "Workforce solutions across manufacturing, retail, logistics, hospitality, BFSI, IT, healthcare, and more."
    )
  });
}

function candidates(_req, res) {
  res.render("pages/candidates", {
    ...pageMeta(
      "/candidates",
      `Candidates & Job Seekers | ${site.shortName}`,
      "Explore opportunities and submit your profile to the PRANAM Consultancy recruitment team."
    )
  });
}

function employers(_req, res) {
  res.render("pages/employers", {
    ...pageMeta(
      "/employers",
      `Employers — Hire Talent | ${site.shortName}`,
      "Share your manpower requirement with PRANAM Consultancy for staffing and recruitment support."
    )
  });
}

function contact(_req, res) {
  res.render("pages/contact", {
    ...pageMeta(
      "/contact",
      `Contact Us | ${site.shortName}`,
      `Contact PRANAM Consultancy Service in ${site.officeArea}, ${site.city}, ${site.state}, India.`
    )
  });
}

function careers(req, res) {
  const filters = {
    location: req.query.location || "",
    category: req.query.category || "",
    experience: req.query.experience || "",
    type: req.query.type || "",
    q: req.query.q || ""
  };
  res.render("pages/careers", {
    ...pageMeta(
      "/careers",
      `Careers & Job Listings | ${site.shortName}`,
      "Review demo job listings and learn how to apply through PRANAM Consultancy. Live vacancies will appear here when published."
    ),
    jobs: filterJobs(filters),
    suggestedJobs: allJobs().sort((a, b) => b.postedDate.localeCompare(a.postedDate)),
    filters,
    options: jobFilters()
  });
}

function jobDetail(req, res, next) {
  const job = findJob(req.params.slug);
  if (!job) {
    const err = new Error("This listing is not available.");
    err.status = 404;
    next(err);
    return;
  }
  res.render("pages/job", {
    ...pageMeta(
      `/jobs/${job.slug}`,
      `${job.title} (Demo) | ${site.shortName}`,
      job.excerpt
    ),
    job
  });
}

function privacy(_req, res) {
  res.render("pages/privacy", {
    ...pageMeta(
      "/privacy",
      `Privacy Policy | ${site.shortName}`,
      "How PRANAM Consultancy handles enquiries, applications, and personal information submitted through this website."
    )
  });
}

function terms(_req, res) {
  res.render("pages/terms", {
    ...pageMeta(
      "/terms",
      `Terms & Conditions | ${site.shortName}`,
      "Website terms for using PRANAM Consultancy's public site and enquiry forms."
    )
  });
}

module.exports = {
  home,
  about,
  services,
  industries,
  candidates,
  employers,
  contact,
  careers,
  jobDetail,
  privacy,
  terms
};
