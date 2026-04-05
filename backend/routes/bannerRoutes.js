const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    createBanner,
    getAllBanners,
    getAdminBanners,
    deleteBanner
} = require('../controllers/bannerController');

// —————————————————————————————————————————————————————————————————————————————
// Public Route
// —————————————————————————————————————————————————————————————————————————————

router.get('/', getAllBanners);

// —————————————————————————————————————————————————————————————————————————————
// Admin Routes
// —————————————————————————————————————————————————————————————————————————————

router.post('/', protect, authorize('admin'), upload.single('image'), createBanner);
router.delete('/:id', protect, authorize('admin'), deleteBanner);

module.exports = router;
