const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description1: {
    type: String,
    required: true
  },
  description2: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  image: {
    type: String,   // store file name
    required: true
  },
  specs: {
    type: Map,
    of: String,
    default: {},
  },

  rating: {
    type: Number,
    default: 0,
  },

  reviews: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Products', productSchema);