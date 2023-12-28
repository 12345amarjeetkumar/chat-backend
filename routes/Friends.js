const express=require("express");
const router=express.Router();


const{searchFriend,addFriend, giveConnectedFriends, fetchPendingRequest,acceptFriendRequest,RejectedFriendRequest}=require("../controllars/Friends")
const{isLoggedIn}=require("../middleware/general")

router.post("/search-friend",isLoggedIn,searchFriend);
router.get("/add-friend/:friendid",isLoggedIn,addFriend);
router.get("/all-friends",isLoggedIn,giveConnectedFriends)
router.get("/all-pending",isLoggedIn,fetchPendingRequest)
router.get("/accept-request/:docid",isLoggedIn,acceptFriendRequest)
router.get("/rejcet-request/:docid",isLoggedIn,RejectedFriendRequest)

module.exports=router