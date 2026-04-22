const jwt = require("jsonwebtoken")
const tokenblacklistModel=require("../models/blacklist.model")

async function authUser(req,res,next){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({message:"token not provided"})
    }
    const isTokenBlacklisted=await tokenblacklistModel.findOne({token})
    if (isTokenBlacklisted) {
        return res.status(401).json({message:"token is invaild"})
    } 
    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET) //if token is wrong or its expire then this verify will throw an error
        req.user=decode
        next()
    }catch(err)
    {
        return res.status(401).json({message:"invalid token"})
    }    
}
module.exports={authUser}