const express = require('express');
const productCtrl = require('../controllers/productController');
const authCtrl = require('../controllers/authController');

const router = express.Router();

router.get('/', productCtrl.getAllProducts);
router.get('/:id', productCtrl.getProduct);

router.use(authCtrl.protect);
router.use(authCtrl.restrictTo('admin'));

router.post('/', productCtrl.uploadImage, productCtrl.createProduct);
router.patch('/:id', productCtrl.updateProduct);
router.delete('/:id', productCtrl.deleteProduct);
router.delete('/', productCtrl.deleteManyProducts);

module.exports = router;