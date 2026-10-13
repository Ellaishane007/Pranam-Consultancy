const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    preferredRole: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    resumePath: { type: String, required: true },
    originalFilename: { type: String, default: "" },
    message: { type: String, default: "" },
    jobSlug: { type: String, default: "" }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.models.Candidate || mongoose.model("Candidate", candidateSchema);
