const express = require('express');
const authCtrl = require('../controllers/authController');
const cartCtrl = require('../controllers/cartController');

const router = express.Router();
// Authentication
router.get('/isLoggedIn', authCtrl.isLoggedIn);
router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);
router.get('/logout', authCtrl.logout);

router.use(authCtrl.protect)
// Cart
router.post('/cart/', cartCtrl.addCartItem);
router.patch('/cart/', cartCtrl.updateCart);
router.patch('/cart/:productId', cartCtrl.updateCartItem);
router.delete('/cart/:productId', cartCtrl.removeCartItem);

module.exports = router;