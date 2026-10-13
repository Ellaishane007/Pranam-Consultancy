const jobs = require("../../data/jobs.demo.json");

function allJobs() {
  return jobs.map((job) => ({ ...job, demo: true }));
}

function findJob(slug) {
  return allJobs().find((job) => job.slug === slug) || null;
}

function filterJobs({ location, category, experience, type, q } = {}) {
  return allJobs().filter((job) => {
    if (location && job.location !== location) return false;
    if (category && job.category !== category) return false;
    if (experience && job.experience !== experience) return false;
    if (type && job.employmentType !== type) return false;
    if (q) {
      const hay = `${job.title} ${job.excerpt} ${job.location} ${job.category}`.toLowerCase();
      if (!hay.includes(String(q).toLowerCase())) return false;
    }
    return true;
  });
}

function jobFilters() {
  const list = allJobs();
  const unique = (key) => [...new Set(list.map((j) => j[key]))].sort();
  return {
    locations: unique("location"),
    categories: unique("category"),
    experiences: unique("experience"),
    types: unique("employmentType")
  };
}

module.exports = { allJobs, findJob, filterJobs, jobFilters };
