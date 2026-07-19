const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    degree: String,
    institution: String,
    year: String,
    details: String,
  },
  { _id: false }
);

// Only one Profile document should ever exist — it represents "you".
const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Sujeet Chaudhary' },
    title: { type: String, default: 'Full Stack Web Developer' },
    summary: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: 'India' },
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    profileImage: { type: String, default: '' }, // hosted image URL (e.g. Cloudinary, imgur)
    education: [educationSchema],
    softSkills: [{ type: String }],
    achievements: [{ type: String }],
    languages: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
