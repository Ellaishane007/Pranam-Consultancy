const sanitizeHtml = require("sanitize-html");

function clean(value = "") {
  return sanitizeHtml(String(value), { allowedTags: [], allowedAttributes: {} }).trim();
}

function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function looksLikePhone(value) {
  return /^[0-9+\-\s()]{8,20}$/.test(value);
}

function fail(errors) {
  const err = new Error("Validation failed");
  err.status = 400;
  err.details = errors;
  return err;
}

function assertNotBot(body) {
  if (body.company_website) {
    const err = new Error("Unable to process this request.");
    err.status = 400;
    throw err;
  }
}

function validateContact(body) {
  assertNotBot(body);
  const data = {
    name: clean(body.name),
    email: clean(body.email).toLowerCase(),
    phone: clean(body.phone),
    subject: clean(body.subject),
    message: clean(body.message)
  };
  const errors = {};
  if (data.name.length < 2) errors.name = "Please enter your name.";
  if (!looksLikeEmail(data.email)) errors.email = "Please enter a valid email address.";
  if (!data.subject) errors.subject = "Please add a subject.";
  if (data.message.length < 10) errors.message = "Please share a short message.";
  if (Object.keys(errors).length) throw fail(errors);
  return data;
}

function validateCandidate(body) {
  assertNotBot(body);
  const data = {
    fullName: clean(body.fullName),
    email: clean(body.email).toLowerCase(),
    phone: clean(body.phone),
    location: clean(body.location),
    preferredRole: clean(body.preferredRole),
    experience: clean(body.experience),
    message: clean(body.message),
    jobSlug: clean(body.jobSlug)
  };
  const errors = {};
  if (data.fullName.length < 2) errors.fullName = "Please enter your full name.";
  if (!looksLikeEmail(data.email)) errors.email = "Please enter a valid email address.";
  if (!looksLikePhone(data.phone)) errors.phone = "Please enter a valid phone number.";
  if (!data.location) errors.location = "Please enter your location.";
  if (!data.preferredRole) errors.preferredRole = "Please enter a preferred role.";
  if (!data.experience) errors.experience = "Please share your experience.";
  if (Object.keys(errors).length) throw fail(errors);
  return data;
}

function validateEmployer(body) {
  assertNotBot(body);
  const data = {
    companyName: clean(body.companyName),
    contactPerson: clean(body.contactPerson),
    email: clean(body.email).toLowerCase(),
    phone: clean(body.phone),
    industry: clean(body.industry),
    positions: clean(body.positions),
    hiringType: clean(body.hiringType),
    jobDescription: clean(body.jobDescription),
    location: clean(body.location),
    message: clean(body.message)
  };
  const errors = {};
  if (!data.companyName) errors.companyName = "Please enter the company name.";
  if (!data.contactPerson) errors.contactPerson = "Please enter a contact person.";
  if (!looksLikeEmail(data.email)) errors.email = "Please enter a valid business email.";
  if (!looksLikePhone(data.phone)) errors.phone = "Please enter a valid phone number.";
  if (!data.industry) errors.industry = "Please select or enter an industry.";
  if (!data.positions) errors.positions = "Please indicate the number of positions.";
  if (!data.hiringType) errors.hiringType = "Please choose a hiring type.";
  if (data.jobDescription.length < 20) errors.jobDescription = "Please describe the role in a little more detail.";
  if (!data.location) errors.location = "Please enter the work location.";
  if (Object.keys(errors).length) throw fail(errors);
  return data;
}

module.exports = { validateContact, validateCandidate, validateEmployer, clean };
