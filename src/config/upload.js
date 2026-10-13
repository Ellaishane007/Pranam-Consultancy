const fs = require("fs");
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
  if (allowed.has(file.mimetype)) {
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

module.exports = { uploadResume, uploadRoot };
