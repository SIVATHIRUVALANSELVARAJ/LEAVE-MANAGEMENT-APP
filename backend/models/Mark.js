const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  username: { type: String, required: true },     // student username
  subject: { type: String, required: true },
  marks: { type: Number, required: true, min: 0, max: 100 }
}, { timestamps: true });

// One mark entry per student per subject
markSchema.index({ username: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Mark', markSchema);
