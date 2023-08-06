const express=require("express");
const { protect } = require("../middlewares/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatControllers");

const router=express.Router();
router.use(express.json());


//accessing the chat or creating the one-on-one chat
router.route('/').post(protect,accessChat);

//get all chat from db for that particular user
router.route('/').get(protect,fetchChats);

//for creation of group
router.route('/group').post(protect,createGroupChat);

//renaming a particular group
router.route('/rename').put(protect,renameGroup);

//remove someone from the group or leave the group
router.route('/groupremove').put(protect,removeFromGroup);

//adding someone to the group
router.route('/groupadd').put(protect,addToGroup);

module.exports=router;