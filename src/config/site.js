const trim = (value) => (typeof value === "string" ? value.trim() : "");

module.exports = {
  legalName: "PRANAM Consultancy",
  shortName: "PRANAM Consultancy",
  founder: "Prashant Chavan",
  foundedYear: 2026,
  city: "Mumbai",
  state: "Maharashtra",
  country: "India",
  industry: "Human Resources & Manpower Consulting",
  tagline: "Connecting Exceptional Talent With Exceptional Opportunities",
  copyrightYear: 2026,
  contact: {
    phone: trim(process.env.CONTACT_PHONE),
    email: trim(process.env.CONTACT_EMAIL),
    address: trim(process.env.CONTACT_ADDRESS),
    hours: trim(process.env.BUSINESS_HOURS),
    linkedin: trim(process.env.LINKEDIN_URL),
    instagram: trim(process.env.INSTAGRAM_URL),
    mapsEmbed: trim(process.env.GOOGLE_MAPS_EMBED_URL)
  },
  nav: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/industries", label: "Industries" },
    { href: "/candidates", label: "Candidates" },
    { href: "/employers", label: "Employers" },
    { href: "/contact", label: "Contact" }
  ],
  services: [
    {
      slug: "permanent-staffing",
      title: "Permanent Staffing",
      summary:
        "Help organizations identify and recruit suitable permanent employees across different roles and industries."
    },
    {
      slug: "temporary-staffing",
      title: "Temporary Staffing",
      summary:
        "Provide flexible workforce solutions for short-term, seasonal, project-based, and operational requirements."
    },
    {
      slug: "payroll-compliance",
      title: "Payroll & Compliance Management",
      summary:
        "Support payroll processing, statutory compliance, workforce documentation, and MIS-related operations."
    },
    {
      slug: "rpo",
      title: "Recruitment Process Outsourcing",
      summary:
        "Provide end-to-end recruitment support, including candidate sourcing, screening, coordination, and hiring processes."
    },
    {
      slug: "manpower-consulting",
      title: "Manpower Consulting",
      summary:
        "Understand workforce requirements and help organizations develop practical staffing solutions."
    }
  ],
  industries: [
    "Manufacturing",
    "Retail",
    "Logistics & Warehousing",
    "Hospitality",
    "Banking & Financial Services",
    "IT & Technology",
    "Healthcare",
    "FMCG",
    "Engineering",
    "E-commerce",
    "Facility Management",
    "Corporate & Administrative"
  ],
  reasons: [
    {
      title: "Experienced HR Professionals",
      text: "A practical, people-first approach shaped by years of workforce consulting in Mumbai and across India."
    },
    {
      title: "Reliable Recruitment Process",
      text: "Clear steps from requirement gathering to shortlist and joining support, with accountable coordination."
    },
    {
      title: "Flexible Workforce Solutions",
      text: "Permanent, temporary, and project-based staffing aligned to how your operations actually run."
    },
    {
      title: "Compliance Support",
      text: "Documentation, payroll, and statutory processes handled with care for both employers and people."
    },
    {
      title: "Industry Understanding",
      text: "Hiring support across manufacturing, services, logistics, hospitality, IT, and corporate functions."
    },
    {
      title: "Candidate-Centric Approach",
      text: "We listen to career goals as closely as we listen to role requirements."
    }
  ],
  process: [
    { step: "01", title: "Understand", text: "We understand your workforce and hiring requirements." },
    { step: "02", title: "Source", text: "We identify potential candidates through suitable recruitment channels." },
    { step: "03", title: "Screen", text: "Candidates are reviewed based on relevant requirements and suitability." },
    { step: "04", title: "Shortlist", text: "Suitable candidates are shortlisted and coordinated with the client." },
    { step: "05", title: "Select", text: "The client conducts the relevant interview and selection process." },
    { step: "06", title: "Onboard", text: "Support the candidate and organization through the joining process." }
  ]
};
