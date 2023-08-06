const express=require('express');
const { protect } = require('../middlewares/authMiddleware');
const { sendMessage, allMessages } = require('../controllers/messageControllers');

const router=express.Router();

router.use(express.json());

router.route('/').post(protect,sendMessage);
router.route('/:chatId').get(protect,allMessages);  //fetching all the message for one single chat

module.exports=router;