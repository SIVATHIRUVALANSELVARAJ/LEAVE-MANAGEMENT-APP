const mongoose = require('mongoose');

// Stores manual +/- adjustments made by the teacher for a student
const adjustmentSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  extraPresent: { type: Number, default: 0 },
  extraAbsent: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('AttendanceAdjustment', adjustmentSchema);
