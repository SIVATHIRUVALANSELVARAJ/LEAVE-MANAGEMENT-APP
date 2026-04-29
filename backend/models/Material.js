const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: String, required: true },
  url: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
