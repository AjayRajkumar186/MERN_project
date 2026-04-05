const mongoose = require('mongoose');

// —————————————————————————————————————————————————————————————————————————————
// User Schema
// —————————————————————————————————————————————————————————————————————————————

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,       // Prevents duplicate emails + auto-creates index
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

// --- Indexes ---
userSchema.index({ role: 1 });                        // filter by role
userSchema.index({ isVerified: 1 });                  // filter unverified users
userSchema.index({ email: 1, isVerified: 1 });        // login + verification checks

module.exports = mongoose.model('Users', userSchema);