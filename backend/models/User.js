const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['teacher', 'student'], default: 'student' },
  email: { type: String },
  age: { type: Number },
  country: { type: String },
  phone: { type: String },
  profileImg: { type: String }
});

module.exports = mongoose.model('User', userSchema);
