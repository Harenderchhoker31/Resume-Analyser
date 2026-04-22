const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"username already taken"],
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:[true,"email already registered"]
    },
    password:{
        type:String,
        required:true
    }
})

const userModel = mongoose.model("user",userSchema)

module.exports=userModel