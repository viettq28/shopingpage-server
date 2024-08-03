const factory = require('./handlerFactory');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.getAllOrders = factory.getAll(Order);
exports.getAllOrdersByOwner = factory.getAll(Order, 'owner');
exports.getOrder = factory.getOne(Order);

exports.createOrder = catchAsync(async (req, res, next) => {
  const { cart, ...rest } = req.body;
  const productList = cart.map((item) => {
    return {
      idProduct: item.product._id,
      image: item.product.images[0],
      name: item.product.name,
      price: item.product.price,
      count: item.quantity,
    };
  });
  const order = await Order.create({...rest, productList});

  transporter.sendMail({
    to: req.body.email,
    from: 'BOUTIQUE',
    subject: 'Order created',
    html: `
      <h1>Xin chào ${req.body.fullname}</h1>
      <h1>Phone: ${req.body.phonenumber}</h1>
      <h1>Address: ${req.body.address}</h1>

      <table style="border: 1px double">
        <tr>
          <th style="border: 1px double">Tên Sản Phẩm</th>
          <th style="border: 1px double">Hình ảnh</th>
          <th style="border: 1px double">Giá</th>
          <th style="border: 1px double">Số lượng</th>
          <th style="border: 1px double">Thành tiền</th>
        </tr>
        ${req.body.cart.map((item) => {
          return `<tr>
            <td style="border: 1px double; text-align: center">${
              item.product.name
            }</td>
            <td style="border: 1px double; text-align: center"><img style='width:40px' src='${
              item.product.images[0]
            }'/></td>
            <td style="border: 1px double; text-align: center">${
              item.product.price
            } VND</td>
            <td style="border: 1px double; text-align: center">${
              item.quantity
            }</td>
            <td style="border: 1px double; text-align: center">${
              item.product.price * item.quantity
            } VND</td>
          </td>`;
        })}
      </table>

      <h1>Tổng Thanh Toán:</h1>
      <h1>${req.body.total}</h1>

      <h1>Cảm ơn bạn</h1>
    `,
  });

  res.status(201).json({
    status: 'success',
    data: order,
  });
});

exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
