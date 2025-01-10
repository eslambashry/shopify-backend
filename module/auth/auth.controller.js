import { userModel } from "../../DB/model/user.model.js"

export const register = async(req,res,next) =>{
           
    const userData = req.body
    const email = req.body.email


        // ! is email Exsist
        const isExsisted = await userModel.findOne({email})
        if(isExsisted){
            return res.status(400).json({message:"Email exsisted"})
        }



    const data = await userModel.insertMany(userData)    
    if(!data) return res.status(404).json({message:"data not found"})



    res.status(201).json({ message: "Register Done Successfully", data})
    




}