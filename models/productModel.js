const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide product's name!"],
  },
  price: {
    type: Number,
    required: [true, "Please provide product's price!"],
  },
  images: {
    type: [String],
    required: [true, "Please provide product's photos!"],
  },
  category: {
    type: String,
    enum: ['iphone', 'ipad', 'macbook', 'airpod', 'watch', 'mouse', 'keyboard', 'other'],
    default: "other",
  },
  long_desc: {
    type: String,
    required: [true, "Please provide product's description!"],
  },
  short_desc: {
    type: String,
    required: [true, "Please provide product's description!"],
  },
  deleted: {
    type: Boolean,
    default: false,
    select: false,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;