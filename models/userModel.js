const mongoose = require('mongoose');
const Product = require('./productModel');
const bcrypt = require('bcryptjs');

const cartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: Product
  },
  quantity: {
    type: Number,
    default: 1
  }
});


const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'Please provide your fullname!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    unique: true,
  },
  role: {
    type: String,
    enum: ['user', 'consultant', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  cart: {
    type: [cartSchema],
    default: [],
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Hash the password before saving to the database
  this.password = await bcrypt.hash(this.password, 17);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
