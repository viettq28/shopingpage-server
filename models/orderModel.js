const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    required: [true, "Please provide order's owner!"],
  },
  fullname: {
    type: String,
    required: [true, "Please provide order's owner fullname!"],
  },
  email: {
    type: String,
    required: [true, "Please provide order's owner email!"],
  },
  phonenumber: {
    type: String,
    required: [true, "Please provide order's owner phone number!"],
  },
  address: {
    type: String,
    required: [true, "Please provide order's owner address!"],
  },
  total: {
    type: Number,
    required: [true, "Please provide order's total!"],
  },
  delivery: {
    type: String,
    enum: ['Waiting for progressing', 'Progressing', 'Delivering', 'Delivered'],
    default: 'Waiting for progressing',
  },
  status: {
    type: String,
    enum: ['Waiting for pay', 'Payed'],
    default: 'Waiting for pay',
  },
  productList: [{
    idProduct: String,
    image: String,
    name: String,
    price: Number,
    count: Number,
  }],
  deleted: {
    type: Boolean,
    default: false,
    select: false,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
