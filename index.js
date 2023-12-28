//importing packages

const mongoose=require("mongoose");
const express=require("express");
const cors=require("cors");

//importing Routes
const authRoutes= require("./routes/Auth")
const friendsRoutes=require("./routes/Friends")
const messagesRoutes=require("./routes/Messages")
const dotenv=require("dotenv")
dotenv.config()

// Special Route: Which will server the uploads folder



// setup app

const app=express();
app.use(express.json());
app.use(cors());

//connecting database


mongoose.connect(process.env.DATABASE_URL)
.then(()=>console.log("Database connected"))
.catch((err)=>console.log("error ocurred while connecting the database"+err.message))

//Adding Routes
app.get("/",(req,res)=>res.json({success:true,message:"Server is running fine"}))

//ading external routes

app.use("/Auth",authRoutes)
app.use("/Friends",friendsRoutes)
app.use("/Messages",messagesRoutes)
app.use("/uploads", express.static("uploads"));

//starting app
const PORT=8000;
app.listen(PORT,()=>console.log(` main server is running PORT : ${PORT}`))

