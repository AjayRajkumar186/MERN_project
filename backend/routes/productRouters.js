const express = require('express');
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const {
  validateCreateProduct,
  validateUpdateProduct,
  checkProductExists,
  formatFormData
} = require('../middleware/productMiddleware');

const upload = require('../middleware/uploadMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');



// GET ALL
router.get('/', getAllProducts);

// GET ONE
router.get('/:id', checkProductExists, getSingleProduct);

// CREATE
router.post(
  '/',
  protect,
  authorize('admin'),
  upload.single('image'),
  formatFormData,
  validateCreateProduct,
  createProduct
);

// UPDATE
router.put(
  '/:id',
  protect,
  authorize('admin'),
  checkProductExists,
  upload.single('image'),
  validateUpdateProduct,
  updateProduct
);

// DELETE
router.delete('/:id', protect, authorize('admin'), checkProductExists, deleteProduct);

module.exports = router;
