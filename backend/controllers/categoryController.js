const Category = require('../models/catgeory');


// ─────────────────────────────────────────────────────────────────────────────
// POST /category  →  only admin can create
// ─────────────────────────────────────────────────────────────────────────────
exports.createCategory = async (req, res) => {
    try{
        const {name} = req.body;
        const category = new Category({
            name
        });
        await category.save();
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category: category
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /category  
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllCategories = async (req, res) => {
    try{
        const categories = await Category.find();
        res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            categories: categories
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /category/:id  
// ─────────────────────────────────────────────────────────────────────────────
exports.getSingleCategory = async (req, res) => {
    try{
        const category = await Category.findById(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Category fetched successfully',
            category: category
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUT /category/:id  -> only admin can update
// ─────────────────────────────────────────────────────────────────────────────
exports.updateCategory = async (req, res) => {
    try{
        const {name} = req.body;
        const category = await Category.findByIdAndUpdate(req.params.id, {name}, {new: true});
        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category: category
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /category/:id  -> only admin can delete
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteCategory = async (req, res) => {
    try{
        const category = await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
            category: category
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}