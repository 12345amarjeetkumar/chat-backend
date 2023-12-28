const mongoose=require("mongoose");
const ChatUser = require("./ChatUser");

const friendSchema=new  mongoose.Schema({
sender:{
type:mongoose.Types.ObjectId,
ref:ChatUser,
required:true
},
reciever:{
    type:mongoose.Types.ObjectId,
    ref:ChatUser,
    required:true,
},
status:{
type:String,
enum:["Pending","Accepted","Rejcted"],
default:"Pending",
required:true
},
connectionId:{
    type:String,
},


});

module.exports=mongoose.model("Friends",friendSchema)