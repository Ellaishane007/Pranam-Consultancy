const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const env = require("./env");

const uploadRoot = path.join(__dirname, "../../uploads/resumes");
fs.mkdirSync(uploadRoot, { recursive: true });

const allowed = new Map([
  ["application/pdf", ".pdf"],
  ["application/msword", ".doc"],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx"]
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const ext = allowed.get(file.mimetype) || path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${uuidv4()}${ext}`);
  }
});

function fileFilter(_req, file, cb) {
  const extension = allowed.get(file.mimetype);
  if (extension && path.extname(file.originalname).toLowerCase() === extension) {
    cb(null, true);
    return;
  }
  const err = new Error("Please upload a PDF, DOC, or DOCX resume.");
  err.status = 400;
  cb(err);
}

const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxResumeMb * 1024 * 1024, files: 1 }
}).single("resume");

async function removeResume(file) {
  try {
    await fsp.unlink(file.path);
  } catch (err) {
    if (err.code !== "ENOENT") console.error("Unable to remove an invalid resume upload.", err);
  }
}

function validateResumeFile(req, _res, next) {
  if (!req.file) {
    next();
    return;
  }

  (async () => {
    const handle = await fsp.open(req.file.path, "r");
    const header = Buffer.alloc(8);
    try {
      await handle.read(header, 0, header.length, 0);
    } finally {
      await handle.close();
    }

    const extension = path.extname(req.file.filename).toLowerCase();
    const isPdf = extension === ".pdf" && header.subarray(0, 5).toString() === "%PDF-";
    const isDoc = extension === ".doc" && header.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
    const isDocx = extension === ".docx" && header.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]));
    if (!isPdf && !isDoc && !isDocx) {
      const err = new Error("The uploaded file does not match its PDF, DOC, or DOCX file type.");
      err.status = 400;
      err.details = { resume: err.message };
      throw err;
    }
    await fsp.chmod(req.file.path, 0o600);
  })().then(() => next(), async (err) => {
    await removeResume(req.file);
    next(err);
  });
}

module.exports = { uploadResume, validateResumeFile, uploadRoot };
