const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Prevents duplicate emails
    lowercase: true, // Standardizes email format
    trim: true
  },
  password: {
    type: String,
    required: true
    // Note: Always hash passwords before saving!
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Users', userSchema);