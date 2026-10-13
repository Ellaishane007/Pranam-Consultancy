const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { isMongoReady } = require("../config/db");
const env = require("../config/env");
const Candidate = require("../models/Candidate");
const EmployerEnquiry = require("../models/EmployerEnquiry");
const ContactMessage = require("../models/ContactMessage");

const localDir = path.join(__dirname, "../../data/local");
const pendingWrites = new Map();

function useMongoStorage() {
  if (!env.mongoUri) return false;
  if (!isMongoReady()) {
    const err = new Error("Submission storage is temporarily unavailable.");
    err.status = 503;
    throw err;
  }
  return true;
}

async function appendJson(file, record) {
  const full = path.join(localDir, file);
  const previous = pendingWrites.get(full) || Promise.resolve();
  const write = previous.catch(() => undefined).then(async () => {
    await fs.mkdir(localDir, { recursive: true, mode: 0o700 });
    let rows;
    try {
      rows = JSON.parse(await fs.readFile(full, "utf8"));
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
      rows = [];
    }
    if (!Array.isArray(rows)) throw new Error(`Local storage file ${file} must contain a JSON array`);
    rows.push(record);
    const temporary = `${full}.${uuidv4()}.tmp`;
    try {
      await fs.writeFile(temporary, JSON.stringify(rows, null, 2), { mode: 0o600 });
      await fs.rename(temporary, full);
    } catch (err) {
      await fs.unlink(temporary).catch((cleanupError) => {
        if (cleanupError.code !== "ENOENT") console.error("Unable to remove temporary storage file.", cleanupError);
      });
      throw err;
    }
    return record;
  });
  pendingWrites.set(full, write);
  try {
    return await write;
  } finally {
    if (pendingWrites.get(full) === write) pendingWrites.delete(full);
  }
}

async function saveCandidate(payload) {
  if (useMongoStorage()) {
    const doc = await Candidate.create(payload);
    return doc.toObject();
  }
  return appendJson("candidates.json", { id: uuidv4(), ...payload, createdAt: new Date().toISOString() });
}

async function saveEmployerEnquiry(payload) {
  if (useMongoStorage()) {
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
  if (useMongoStorage()) {
    const doc = await ContactMessage.create(payload);
    return doc.toObject();
  }
  return appendJson("contacts.json", { id: uuidv4(), ...payload, createdAt: new Date().toISOString() });
}

module.exports = { saveCandidate, saveEmployerEnquiry, saveContact };
