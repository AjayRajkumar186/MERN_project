const express = require('express');
const router = express.Router();
const {createCategory,getAllCategories,getSingleCategory,updateCategory,deleteCategory} = require('../controllers/categoryController');
const {checkcategoryExists} = require('../middleware/categoryMiddleware');

router.post('/',checkcategoryExists,createCategory);
router.get('/',getAllCategories);
router.get('/:id',getSingleCategory);
router.put('/:id',checkcategoryExists,updateCategory);
router.delete('/:id',checkcategoryExists,deleteCategory);

module.exports = router;