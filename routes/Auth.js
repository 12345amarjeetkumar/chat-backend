//import packages

const express=require("express");
const router=express.Router();

const{Login,Signup,activateAccount,uploadProfilePic}=require("../controllars/Auth")

const {upload}=require("../middleware/multer");
const {isLoggedIn}=require("../middleware/general")

router.post("/Login",Login)

router.post("/Signup",Signup)

router.get("/activate-account/:token",activateAccount)

router.post("/upload/profile-pic",isLoggedIn,upload.single("profilepic"),uploadProfilePic)



module.exports=router