const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createNotification,
  getAllNotifications,
  markAsRead,
  deleteNotification,
  clearNotifications
} = require('../controllers/notificationController');

// —————————————————————————————————————————————————————————————————————————————
// Public Route
// —————————————————————————————————————————————————————————————————————————————

router.post('/', protect, createNotification);

// —————————————————————————————————————————————————————————————————————————————
// Admin Routes
// —————————————————————————————————————————————————————————————————————————————

router.get('/', protect, authorize('admin'), getAllNotifications);

// —————————————————————————————————————————————————————————————————————————————
// PUT /notifications/:id  →  admin only
// —————————————————————————————————————————————————————————————————————————————

router.put('/:id', protect, authorize('admin'), markAsRead);

// —————————————————————————————————————————————————————————————————————————————
// DELETE /notifications/:id  →  admin only (single)
// —————————————————————————————————————————————————————————————————————————————

router.delete('/:id', protect, authorize('admin'), deleteNotification);

// —————————————————————————————————————————————————————————————————————————————
// DELETE /notifications  →  admin only (clear all)
// —————————————————————————————————————————————————————————————————————————————

router.delete('/', protect, authorize('admin'), clearNotifications);

module.exports = router;
