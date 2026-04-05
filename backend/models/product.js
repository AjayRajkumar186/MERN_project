const mongoose = require('mongoose');

// —————————————————————————————————————————————————————————————————————————————
// Product Schema
// —————————————————————————————————————————————————————————————————————————————

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  title: { type: String, required: true },
  description1: { type: String, required: true },
  description2: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true
  },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: true },
  specs: {
    type: Map,
    of: String,
    default: {}
  },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 }
}, { timestamps: true });


productSchema.index({ category: 1 });                 // filter by category (most common)
productSchema.index({ price: 1 });                    // sort/filter by price
productSchema.index({ rating: -1 });                  // top-rated products
productSchema.index({ createdAt: -1 });               // newest first
productSchema.index({ category: 1, price: 1 });       // compound: category + price range
productSchema.index({ title: 'text', description1: 'text' }); // full-text search

module.exports = mongoose.model('Products', productSchema);