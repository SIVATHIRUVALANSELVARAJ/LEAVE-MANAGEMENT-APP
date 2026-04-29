const mongoose = require('mongoose');

const odSchema = new mongoose.Schema({
  username: { type: String, required: true },
  event: { type: String, required: true },
  date: { type: Date, required: true },
  proofFile: { type: String, default: '' },   // stored filename in uploads/
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('OD', odSchema);
