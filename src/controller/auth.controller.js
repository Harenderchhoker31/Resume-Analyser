const userModel=require("../models/user.model.js")
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken")

async function registerUserController(req,res) {
    
    const {username,email,password}=req.body
    if (!username || !email || !password){
        return res.status(400).json({message:"all fields are required"})
    }
    
    const userExists=await userModel.findOne({$or:[{email},{username}]}) 
    if(userExists){
        return res.status(400).json({message:"user with email or username already exists"})
    }   
    const hash = await bcrypt.hash(password,10)

    const user=await userModel.create({
        username,
        email,
        password:hash
    })
    
    const token=jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token)
    res.status(201).json({
        message:"user created successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }, 
    })
     

}
async function loginUserController(req,res){
    const {email,password}=req.body
    const user=await userModel.findOne({email})
}
module.exports={registerUserController}