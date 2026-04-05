const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/auth');
const otpGenerator = require('otp-generator');
const sendEmail = require('../utils/sendEmail');

console.log("JWT Secret Loaded:", process.env.JWT_SECRET ? "YES" : "NO");

// ─────────────────────────────────────────────────────────────────────────────
// POST /login  →  user can login
// ─────────────────────────────────────────────────────────────────────────────
exports.loginUser = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Find user and Standardize input
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please register first.' });
    }

    if (!user.isVerified) {
       return res.status(401).json({ message: 'Please verify your account first.' });
    }

    // 3. Generate OTP
    const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes
    await user.save();

    // 4. Send Email
    await sendEmail({
      to: email,
      subject: 'Shopmate Login Verification',
      text: `Your login OTP is: ${otp}. It will expire in 10 minutes.`
    });

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify to login.",
      requireOtp: true,
      email: user.email
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /verify-login  →  user can verify login
// ─────────────────────────────────────────────────────────────────────────────
exports.verifyLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || user.otp !== String(otp) || user.otpExpires < new Date()) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token,
      authorization: `Bearer ${token}`,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Verify Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
