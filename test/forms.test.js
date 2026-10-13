const assert = require("node:assert/strict");
const { test } = require("node:test");
const { validateContact, validateCandidate, validateEmployer } = require("../src/validators/forms");
const env = require("../src/config/env");
const storage = require("../src/services/storage");
const site = require("../src/config/site");
const { allJobs, filterJobs, jobFilters } = require("../src/services/jobsService");

test("contact validation trims input and strips markup", () => {
  const result = validateContact({
    name: "  <b>Alex Smith</b>  ",
    email: " ALEX@example.com ",
    phone: "",
    subject: " Enquiry ",
    message: " Please contact me about staffing. "
  });
  assert.equal(result.name, "Alex Smith");
  assert.equal(result.email, "alex@example.com");
  assert.equal(result.subject, "Enquiry");
});

test("candidate validation rejects missing required fields", () => {
  assert.throws(
    () => validateCandidate({ fullName: "A", email: "bad", phone: "", location: "", preferredRole: "", experience: "" }),
    (err) => err.status === 400 && Boolean(err.details.email) && Boolean(err.details.phone)
  );
});

test("employer validation accepts complete enquiries", () => {
  const result = validateEmployer({
    companyName: "Example Ltd",
    contactPerson: "Jordan Lee",
    email: "jordan@example.com",
    phone: "+91 98765 43210",
    industry: "Technology",
    positions: "3",
    hiringType: "Permanent",
    jobDescription: "We need experienced software engineers for our product team.",
    location: "Mumbai",
    message: ""
  });
  assert.equal(result.companyName, "Example Ltd");
  assert.equal(result.location, "Mumbai");
});

test("configured MongoDB outages never fall back to local form storage", async () => {
  const originalMongoUri = env.mongoUri;
  env.mongoUri = "mongodb://127.0.0.1:27017/pranam-test";
  try {
    await assert.rejects(
      storage.saveContact({ name: "Test", email: "test@example.com", subject: "Test", message: "Test message" }),
      (err) => err.status === 503
    );
  } finally {
    env.mongoUri = originalMongoUri;
  }
});

test("every industry has multiple demo listings", () => {
  const jobs = allJobs();
  const categories = jobFilters().categories;
  for (const category of site.industries) {
    assert.ok(categories.includes(category), `Missing demo jobs for ${category}`);
    assert.ok(jobs.filter((job) => job.category === category).length >= 2, `Expected multiple jobs for ${category}`);
  }
});

test("job search matches role and skill keywords across multiple terms", () => {
  assert.ok(filterJobs({ q: "software developer" }).some((job) => job.slug === "demo-software-developer-pune"));
  assert.ok(filterJobs({ q: "warehouse stock" }).some((job) => job.slug === "demo-inventory-associate-navi-mumbai"));
  assert.ok(filterJobs({ q: "PAYROLL" }).some((job) => job.slug === "demo-payroll-assistant-pune"));
  assert.equal(filterJobs({ q: "software developer", category: "Retail" }).length, 0);
});
