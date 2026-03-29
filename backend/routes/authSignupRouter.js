const express = require('express');
const router = express.Router();
const { registerUser, verifySignup } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public Routes
router.post('/', registerUser);
router.post('/verify', verifySignup);

// Protected Route (Any logged-in user)
router.get('/profile', protect, (req, res) => {
  res.json({ message: `Welcome ${req.user.id}`, data: req.user });
});

// Admin Only Route (e.g., Shopmate Inventory Management)
router.get('/admin-dashboard', protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome to the Admin Panel" });
});

module.exports = router;
