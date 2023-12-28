const { json } = require("express");
const User=require("../Modals/ChatUser")
const Friends=require("../Modals/Friends")
const Pusher=require("pusher")
const dotenv=require("dotenv")
dotenv.config()

const pusher = new Pusher({
    appId: process.env.appId,
    key: process.env.key,
    secret: process.env.secret,
    cluster: process.env.cluster,
    useTLS: true
  });
  

const searchFriend=(req,res)=>{
   // console.log(req.user)
    const{ query}=req.body;
    User.find({$text :{$search:query}})
    .select("name _id email")
    .then((users)=>{
        // console.log(users)
         res.status(200).json({success:true,users})
    })
    .catch((err)=>{
        res.status(500).json({success:false,message:err.message})
    });
};

const addFriend= async(req,res)=>{
    const { friendid } = req.params;

    // 1. check if user with this friendid exist or not
    try {
      const friend = await User.findById(friendid);
  
      // check if loggedin user nad friend id same
      if (req.user._id == friendid)
        return res.status(400).json({
          success: false,
          message: "You cannot send request to yourself",
        });
  
      if (!friend) {
        return res
          .status(400)
          .json({ success: false, message: "No user Found by this Id" });
      }
         //generate the unique id by combining user id
      
      let connectionid;
      if(req.user._id>friendid)
      {
           connectionid=req.user._id + friendid;
      }
         else {connectionid=friendid+req.user._id}


       // check if already in connection
       const alreadyInConnection=await Friends.findOne({
        connectionId:connectionid,
        $or:[{status:"Pending"},{status:"Accepted"}],
       });
       if(alreadyInConnection) 
       return res
       .status(400)
       .json({ success: false, message: "Already in friends" });
    
    
      
    const newfriend= await Friends.create({sender:req.user._id,reciever:friendid,connectionId:connectionid});

      const friendrequest=await Friends.findById(newfriend._id).populate("sender")

    pusher.trigger("new-message-Chhanel","friend-request",friendrequest)
      return res
              .status(200)
              .json({success:true,message:"friend request sent"});
} catch(err){
    return res.status(500).json({success:false,message:err.message});
}

};

const giveConnectedFriends=async(req,res)=>{
    try {
    const friends=await Friends.find({status:"Accepted",$or:[{sender:req.user._id},{reciever:req.user._id}]}).populate("sender reciever");
    return res.status(200).json({success:true,friends})
} catch(err){
    return res(500).json({success:false,message:err.message})
}
}

const fetchPendingRequest=async(req,res)=>{
    try {
        const friends=await Friends.find({status:"Pending",reciever:req.user._id,}).populate("sender");
        
        return res.status(200).json({success:true,friends})
    } catch(err){
        return res.status(500).json({success:false,message:err.message})
    }
}

const acceptFriendRequest=async(req,res)=>{
    try{
        const {docid}=req.params
      const result=  await Friends.findOneAndUpdate({_id:docid, reciever:req.user._id}, {status:"Accepted"})

      // fetch again to populate the send data
      const acceptedreq= await Friends.findById(docid).populate("reciever sender")
      
      pusher.trigger("new-message-Chhanel","friend-request-Accepted",acceptedreq)

        return res.status(200).json({success:true,message:"req Accepted"})
        if(!result){
            return res.status(400),json({success:false,message:"Invalid reuest"})
        }
    }
    catch(err){
        return res.status(500).json({success:false,message:err.message})
    }

}

const RejectedFriendRequest=async(req,res)=>{
    const {docid}=req.params
    const result= await Friends.findOneAndUpdate({_id:docid, reciever:req.user._id}, {status:"Rejcted"});

    if(result)
    return res.status(200).json({success:true,message:"Request Rejected"});

    return res.status(500).json({success:false,message:"Something went wrong"})

}

module.exports={searchFriend,addFriend,giveConnectedFriends,fetchPendingRequest,acceptFriendRequest,RejectedFriendRequest};