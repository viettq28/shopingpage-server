const multer = require('multer');
const factory = require('./handlerFactory');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `public/products/`;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `product-${uuidv4()}-${req.user._id}.${ext}`);
  },
});

// const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image file!'));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadImage = upload.array('images', 5);
exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product);

exports.createProduct = catchAsync(async (req, res, next) => {
  const images = req.files.map(
    (file) =>
      `${req.protocol}://${req.get('host')}/${file.destination.split('/')[1]}/${
        file.filename
      }`
  );
  req.body.images = images;

  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newProduct,
  });
});

exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
exports.deleteManyProducts = catchAsync(async (req, res) => {
  console.log(req.body)
  const newProducts = await Product.updateMany(
    { _id: { $in: req.body } },
    { $set: { deleted: true } }
  );

  if (!newProducts) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: newProducts,
  });
});
