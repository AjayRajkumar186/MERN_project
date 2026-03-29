const Notification = require('../models/notification');

// ─────────────────────────────────────────────────────────────────────────────
// POST /notifications  →  Both roles (admin & user) can create
// ─────────────────────────────────────────────────────────────────────────────
exports.createNotification = async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'name, phone, and message are required'
      });
    }

    const notification = await Notification.create({ name, phone, message });

    res.status(201).json({
      success: true,
      notification
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /notifications  →  Admin only
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /notifications/:id/read  →  Admin only
// ─────────────────────────────────────────────────────────────────────────────
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /notifications/:id  →  Admin only
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /notifications  →  Admin only (clear all)
// ─────────────────────────────────────────────────────────────────────────────
exports.clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({});

    res.status(200).json({ success: true, message: 'All notifications cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
