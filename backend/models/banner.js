const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    sortOrder: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
