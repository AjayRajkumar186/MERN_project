const mongoose = require('mongoose');
const Product = require('../models/product');
const User = require('../models/auth');

const buildProductPayload = (req, { isCreate = false } = {}) => {
  const payload = {};
  const { title, description1, description2, category, price, stock, rating, reviews } = req.body;

  if (title !== undefined) payload.title = title;
  if (description1 !== undefined) payload.description1 = description1;
  if (description2 !== undefined) payload.description2 = description2;
  if (category !== undefined) payload.category = category;
  if (price !== undefined) payload.price = price;
  if (stock !== undefined) payload.stock = stock;
  if (rating !== undefined) payload.rating = Number(rating);
  if (reviews !== undefined) payload.reviews = Number(reviews);

  // Handle specs from form-data (sent as specs.display, specs.processor, etc.)
  const specsObj = {};
  let hasSpecs = false;

  for (const key of Object.keys(req.body)) {
    if (key.startsWith('specs.')) {
      const specKey = key.replace('specs.', '');
      specsObj[specKey] = req.body[key];
      hasSpecs = true;
    }
  }

  // Also handle specs sent as JSON string or object
  if (!hasSpecs && req.body.specs !== undefined) {
    try {
      const parsed = typeof req.body.specs === 'string' ? JSON.parse(req.body.specs) : req.body.specs;
      Object.assign(specsObj, parsed);
      hasSpecs = true;
    } catch (err) {
      // ignore invalid JSON
    }
  }

  if (hasSpecs) {
    payload.specs = specsObj;
  }

  if (req.file) {
    payload.image = req.file.filename;
  }

  if (isCreate) {
    // Convert to proper ObjectId to ensure populate works
    payload.user = new mongoose.Types.ObjectId(req.user.id);
  }

  return payload;
};

// CREATE
exports.createProduct = async (req, res) => {
  try {
    // Verify user exists in database before creating product
    const userExists = await User.findById(req.user.id);
    if (!userExists) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again with a valid account.'
      });
    }

    const product = await Product.create(buildProductPayload(req, { isCreate: true }));
    await product.populate([{ path: 'user', select: 'username email role' }, { path: 'category', select: 'name' }]);

    res.status(201).json({
      success: true,
      products: product
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};

// GET ALL
exports.getAllProducts = async (req, res) => {
  try {
    let query = {};

    // Check if category is provided in query params (e.g. ?category=uuid)
    if (req.query.category) {
      query.category = req.query.category;
    }

    const products = await Product.find(query)
      .populate('user', 'username email role')
      .populate('category', 'name');

    res.status(200).json({
      success: true,
      count: products.length,
      products: products
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: 'Server Error'
    });

  }
};

// GET ONE
exports.getSingleProduct = async (req, res) => {
  res.status(200).json({
    success: true,
    products: req.product
  });
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const updateData = buildProductPayload(req);

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('user', 'username email role').populate('category', 'name');

    res.status(200).json({
      success: true,
      products: product
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      error: err.message
    });

  }
};

// DELETE
exports.deleteProduct = async (req, res) => {
  try {

    await req.product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product removed'
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: 'Server Error'
    });

  }
};
