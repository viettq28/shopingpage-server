const express = require('express');
const orderCtrl = require('../controllers/orderController');
const authCtrl = require('../controllers/authController');

const router = express.Router();

router.use(authCtrl.protect);

router.get('/:id', orderCtrl.getAllOrdersByOwner);
router.post('/', orderCtrl.createOrder);
router.get('/:id', orderCtrl.getOrder);

router.use(authCtrl.restrictTo('admin'));

router.get('/', orderCtrl.getAllOrders);
router.patch('/:id', orderCtrl.updateOrder);
router.delete('/:id', orderCtrl.deleteOrder);

module.exports = router;