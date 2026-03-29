const Category = require('../models/catgeory');

exports.checkcategoryExists = async (req, res, next) => {
    try {
        const { name } = req.body;
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists'
            });
        }
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}