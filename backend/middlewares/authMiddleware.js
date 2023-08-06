const jwt=require('jsonwebtoken')
const User=require("../models/userModel.js");
const asyncHandler=require("express-async-handler");


const protect=asyncHandler(async(req,res,next)=>{
    let token;

    if(
        req.headers.authorization &&   //I am gonna send token inside header of request
        req.headers.authorization.startsWith("Bearer")
    ){
        try{
            //token in the form of Bearer hbvhcvsmdjfeh
            token=req.headers.authorization.split(" ")[1];

            //decodes token id
            const decoded=jwt.verify(token,process.env.JWT_SECRET);

            req.user=await User.findById(decoded.id).select("-password");  //returning it without password

            next();
        }catch(error){
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }
    if (!token) {
        res.status(401);
        throw new Error("Not authorized,no token");
    }
});
module.exports={protect};