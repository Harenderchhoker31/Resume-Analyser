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
        process.env
    )
     

}
module.exports={registerUserController}