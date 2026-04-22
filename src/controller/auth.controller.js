const userModel=require("../models/user.model.js")
const bcrypt=require("bcrypt")

async function registerUserController(req,res) {
    
    const {username,email,password}=req.body
    if (!username || !email || !passwor){
        return res.status(400).json({message:"all fields are required"})
    }
    
    const userExists=await userModel.findOne({$or:[{email},{username}]}) 
    if(userExists){
        return res.status(400).json({message:"user with email or username already exists"})
    }   
    try{
        const user=await userModel.create({
            username,
            email,
            password
        })
        res.status(200).json({
            success:true,
            data:user
        })

    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
     

}
module.exports={registerUserController}