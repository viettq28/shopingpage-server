const express = require('express');
const sessionCtrl = require('../controllers/chatController');

const router = express.Router();

router.get('/', sessionCtrl.getAllChatSessions);
router.get('/:id', sessionCtrl.getChatSession);

module.exports = router;