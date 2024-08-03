const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    fullname: req.body.fullname,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  });

  res.status(statusCode).json({
    status: 'success',
    data: {
      newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // Check if user exists in DB and password is correct
  const user = await User.findOne({ email }).select('+password');
  const isPasswordCorrect = await user?.correctPassword(password, user.password);
  if (!user || !isPasswordCorrect) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // Send token to client if everything is ok
  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  // Rewrite current client jwt cookie with "loggedout"
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    // Verify token
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    
    // Check if user still exists
    const currentUser = await User.findById(decoded.id).select('-__v').populate({
      path: 'cart',
      populate: { path: 'product'}
    });
    if (!currentUser) {
      return next();
    }

    res.status(200).json({
      status: 'success',
      data: currentUser,
    });
  }
  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // Check if token exists
  if (!token)
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // Check if user still exists
  const curUser = await User.findById(decoded.id);
  
  if (!curUser) {
    return next(
      new AppError('The user belongs to this token does no longer exist', 401)
    );
  }
  
  req.user = curUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );

    }
    next();
  };
};
