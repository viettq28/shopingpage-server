const express = require('express');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

router.get(
  '/',
  catchAsync(async (req, res, next) => {
    const userNumber = await User.countDocuments({ role: { $ne: 'admin' } });
    const orderStat = await Order.aggregate([
      {
        $group: {
          _id: null,
          orderNumber: { $sum: 1 },
          earning: { $sum: '$total' },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        userNumber,
        orderNumber,
        earning,
      },
    });
  })
);

module.exports = router;