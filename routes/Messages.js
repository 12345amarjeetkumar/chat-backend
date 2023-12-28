const express=require("express");
const router=express.Router();

const{sendMessage,fetchAllMessage}=require("../controllars/Messages")
const{isLoggedIn}=require("../middleware/general")


router.post("/send-message",isLoggedIn,sendMessage)
router.get("/get-message/:reciever",isLoggedIn,fetchAllMessage)

module.exports=router