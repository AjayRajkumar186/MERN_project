const Banner = require('../models/banner');

// ─────────────────────────────────────────────────────────────────────────────
// POST /banner  -> only admin can create
// ─────────────────────────────────────────────────────────────────────────────
exports.createBanner = async (req, res) => {
    try {
        const { isActive, sortOrder } = req.body;
        let image = '';

        if (req.file) {
            image = req.file.filename;
        } else {
            return res.status(400).json({ success: false, message: 'Image is required' });
        }

        const banner = await Banner.create({
            image,
            isActive: isActive !== undefined ? isActive : true,
            sortOrder: sortOrder || 0
        });

        res.status(201).json({
            success: true,
            banner
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /banner  
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: banners.length,
            banners
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


// ─────────────────────────────────────────────────────────────────────────────
// DELETE /banner/:id  -> only admin can delete
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);

        if (!banner) {
            return res.status(404).json({ success: false, message: 'Banner not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Banner removed'
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
