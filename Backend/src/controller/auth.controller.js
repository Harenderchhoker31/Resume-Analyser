const userModel=require("../models/user.model.js")
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken")
const tokenblacklistModel=require('../models/blacklist.model.js')

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
    if(!user){
        return res.status(400).json({message:"invalid email or password"})
    }   
    const isPasswordVaild = await bcrypt.compare(password,user.password)
    if (!isPasswordVaild){
        return res.status(400).json({message:"invalid email or password"})
    }

     const token=jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token)  
    res.status(200).json({message:"User loggedIn Successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        },
    })
}

async function logoutUserController(req,res){
    const token=req.cookies.token

    if(token){
        await tokenblacklistModel.create({token})
    }
    res.clearCookie('token')
    res.status(200).json({message:"user logged out successfully"})
}

async function getMeController(req,res){
    const user = await userModel.findById(req.user.id) 

    res.status(200).json({
        message:"user fetched successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

module.exports={registerUserController,loginUserController,logoutUserController,getMeController}