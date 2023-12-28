const Messages=require("../Modals/Messages")
const { json } = require("express");
const Friends=require("../Modals/Friends")
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1715985",
  key: "41daf260a50ae3c16aa2",
  secret: "168435fdb2b40022029d",
  cluster: "ap2",
  useTLS: true
});

const sendMessage=async(req,res)=>{
   
    try{
      const {message,reciever}= req.body 
      let messageId;
      if(reciever>req.user._id){
        messageId=reciever+req.user._id
      }
      else{
        messageId=req.user._id+reciever
      }
      const newMessage= await Messages.create({messages:message,sender:req.user._id,reciever:reciever,messageId:messageId})

      pusher.trigger("new-message-Chhanel","Message-Added",newMessage)

        return res.status(200).json({success:true,message:"Message Sent"})
    } 
    catch(err){
        return res.status(500).json({success:false,message:err.message})
    }

}

const fetchAllMessage=async(req,res)=>{

    try{
        const {reciever}= req.params;
        let messageId;

        if(reciever>req.user._id){
          messageId=reciever+req.user._id
        }
        else{
          messageId=req.user._id+reciever
        }
         const messages=await Messages.find({messageId:messageId,});

          return res.status(200).json({success:true, messages});
      } 
      catch(err){
          return res.status(500).json({success:false,message:err.message})
      }
}

module.exports={sendMessage,fetchAllMessage};