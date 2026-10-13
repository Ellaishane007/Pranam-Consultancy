const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { isMongoReady } = require("../config/db");
const Candidate = require("../models/Candidate");
const EmployerEnquiry = require("../models/EmployerEnquiry");
const ContactMessage = require("../models/ContactMessage");

const localDir = path.join(__dirname, "../../data/local");

async function appendJson(file, record) {
  await fs.mkdir(localDir, { recursive: true });
  const full = path.join(localDir, file);
  let rows = [];
  try {
    rows = JSON.parse(await fs.readFile(full, "utf8"));
  } catch {
    rows = [];
  }
  rows.push(record);
  await fs.writeFile(full, JSON.stringify(rows, null, 2));
  return record;
}

async function saveCandidate(payload) {
  if (isMongoReady()) {
    const doc = await Candidate.create(payload);
    return doc.toObject();
  }
  return appendJson("candidates.json", { id: uuidv4(), ...payload, createdAt: new Date().toISOString() });
}

async function saveEmployerEnquiry(payload) {
  if (isMongoReady()) {
    const doc = await EmployerEnquiry.create(payload);
    return doc.toObject();
  }
  return appendJson("employer-enquiries.json", {
    id: uuidv4(),
    ...payload,
    createdAt: new Date().toISOString()
  });
}

async function saveContact(payload) {
  if (isMongoReady()) {
    const doc = await ContactMessage.create(payload);
    return doc.toObject();
  }
  return appendJson("contacts.json", { id: uuidv4(), ...payload, createdAt: new Date().toISOString() });
}

module.exports = { saveCandidate, saveEmployerEnquiry, saveContact };
