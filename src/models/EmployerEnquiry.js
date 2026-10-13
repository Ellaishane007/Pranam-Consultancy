const mongoose = require("mongoose");

const employerEnquirySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    positions: { type: String, required: true, trim: true },
    hiringType: { type: String, required: true, trim: true },
    jobDescription: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    message: { type: String, default: "" }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports =
  mongoose.models.EmployerEnquiry || mongoose.model("EmployerEnquiry", employerEnquirySchema);
