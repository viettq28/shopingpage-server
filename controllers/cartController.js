const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { ObjectId } = require('mongoose').Types;

exports.addCartItem = catchAsync(async (req, res, next) => {
  const { product, quantity = 1 } = req.body;
  const existedItem = req.user.cart.find(
    (i) => i.product.toString() === product
  );
  if (existedItem) {
    existedItem.quantity = quantity;
  } else {
    req.user.cart.push({
      product: new ObjectId(product),
      quantity,
    });
  }
  const user = await req.user.save();
  res.status(201).json({
    status: 'success',
    data: user,
  });
});

exports.removeCartItem = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;

  const existedItem = req.user.cart.find((i) => i.product.toString() === productId);

  if (!existedItem) {
    return next(new AppError('No item found with that ID', 404));
  }

  req.user.cart.pull(existedItem._id);

  await req.user.save();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateCartItem = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;
  const quantity = req.query.quantity;

  const existedItem = req.user.cart.find(
    (i) => i.product.toString() === productId
  );
  if (!existedItem) {
    return next(new AppError('No item found with that ID', 404));
  }
  existedItem = { ...existedItem, quantity };

  const user = await req.user.save();

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.updateCart = catchAsync(async (req, res) => {
  req.user.cart = req.body;

  const user = await req.user.save();

  res.status(200).json({
    status: 'success',
    data: user,
  });
});
