const Product = require('../models/product');

const hasValue = (value) => value !== undefined && value !== null && String(value).trim() !== '';

const validateTitle = (title, res) => {
  if (title.length < 3) {
    res.status(400).json({
      success: false,
      message: 'Title too short'
    });
    return false;
  }

  return true;
};

const validatePrice = (price, res) => {
  if (Number.isNaN(Number(price)) || Number(price) <= 0) {
    res.status(400).json({
      success: false,
      message: 'Price must be positive'
    });
    return false;
  }

  return true;
};

const validateStock = (stock, res) => {
  if (Number.isNaN(Number(stock)) || Number(stock) < 0) {
    res.status(400).json({
      success: false,
      message: 'Stock must be zero or more'
    });
    return false;
  }

  return true;
};

exports.validateCreateProduct = (req, res, next) => {
  const { title, description1, description2, category, stock, price } = req.body;

  if (
    !hasValue(title) ||
    !hasValue(description1) ||
    !hasValue(description2) ||
    !hasValue(category) ||
    !hasValue(stock) ||
    !hasValue(price) ||
    !req.file
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  if (
    !validateTitle(title, res) ||
    !validatePrice(price, res) ||
    !validateStock(stock, res)
  ) {
    return;
  }

  // validate specs format
  if (req.body.specs) {
    try {
      if (typeof req.body.specs === "string") {
        JSON.parse(req.body.specs);
      }
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid specs format",
      });
    }
  }

  next();
};

exports.validateUpdateProduct = (req, res, next) => {
  const { title, description1, description2, category, stock, price } = req.body;
  const hasBodyFields = [title, description1, description2, category, stock, price].some(hasValue);

  if (!hasBodyFields && !req.file) {
    return res.status(400).json({
      success: false,
      message: 'Provide at least one field to update'
    });
  }

  if (hasValue(title) && !validateTitle(title, res)) {
    return;
  }

  if (hasValue(price) && !validatePrice(price, res)) {
    return;
  }

  if (hasValue(stock) && !validateStock(stock, res)) {
    return;
  }

  // validate specs format
  if (req.body.specs) {
    try {
      if (typeof req.body.specs === "string") {
        JSON.parse(req.body.specs);
      }
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid specs format",
      });
    }
  }

  next();
};

exports.checkProductExists = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('user', 'username email role').populate('category', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    req.product = product;
    next();

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
};

exports.formatFormData = (req, res, next) => {
  // Parse the specs string back into an object
  if (req.body.specs) {
    try {
      req.body.specs = JSON.parse(req.body.specs);
    } catch (err) {
      return res.status(400).json({ message: "Invalid specs format" });
    }
  }

  // Convert string numbers back to actual numbers
  if (req.body.price) req.body.price = Number(req.body.price);
  if (req.body.stock) req.body.stock = Number(req.body.stock);
  if (req.body.rating) req.body.rating = Number(req.body.rating);
  if (req.body.reviews) req.body.reviews = Number(req.body.reviews);

  // Trick the validator by putting the image filename into req.body
  if (req.file) {
    req.body.image = req.file.filename; // or req.file.path, depending on what you save to the DB
  }

  next();
}; 