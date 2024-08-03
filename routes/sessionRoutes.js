const express = require('express');
const sessionCtrl = require('../controllers/chatController');
const authCtrl = require('../controllers/authController');

const router = express.Router();

router.use(authCtrl.protect);
router.get('/', authCtrl.restrictTo('admin', 'consultant'), sessionCtrl.getAllChatSessions);
router.get('/:id', sessionCtrl.getChatSession);

module.exports = router;