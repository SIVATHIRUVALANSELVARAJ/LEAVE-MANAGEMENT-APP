const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  username: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true }
}, { timestamps: true });

// Ensure one record per user per day
attendanceSchema.index({ username: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
