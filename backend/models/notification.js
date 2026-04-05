const mongoose = require('mongoose');

// —————————————————————————————————————————————————————————————————————————————
// Notification Schema
// —————————————————————————————————————————————————————————————————————————————

const notificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }   // gives createdAt & updatedAt automatically
);

module.exports = mongoose.model('Notification', notificationSchema);
