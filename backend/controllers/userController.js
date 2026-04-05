const User = require('../models/auth');
const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');
const sendEmail = require('../utils/sendEmail');

// ─────────────────────────────────────────────────────────────────────────────
// POST /register  -> create user
// ─────────────────────────────────────────────────────────────────────────────
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // 1. Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Generate OTP
    const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes

    // 4. Create or update user
    if (existingUser && !existingUser.isVerified) {
      existingUser.username = username;
      existingUser.password = hashedPassword;
      existingUser.role = role || existingUser.role;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      await existingUser.save();
    } else {
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role,
        otp,
        otpExpires,
        isVerified: false
      });
      await newUser.save();
    }

    // 5. Send Email
    await sendEmail({
      to: email,
      subject: 'Verify your Shopmate account',
      text: `Your verification OTP is: ${otp}. It will expire in 10 minutes.`
    });

    res.status(201).json({ message: "OTP sent to email. Please verify to complete registration." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /verify-signup  -> verify user
// ─────────────────────────────────────────────────────────────────────────────
exports.verifySignup = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== String(otp) || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Account successfully verified." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
