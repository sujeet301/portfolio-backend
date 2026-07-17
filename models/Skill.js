const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Skill name is required'], trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Languages', 'Frontend', 'Backend', 'Database', 'Tools', 'Soft Skills', 'Other'],
      default: 'Other',
    },
    percentage: { type: Number, min: 0, max: 100, default: 70 },
    icon: { type: String, default: '' }, // e.g. "react", "nodejs" — matched to an icon on the frontend
    order: { type: Number, default: 0 }, // controls display order within a category
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
