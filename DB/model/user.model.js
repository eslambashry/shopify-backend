import { model, Schema } from "mongoose";

import bcrypt from "bcrypt"
const userSchema = new Schema(

    {
        username:{
            type:String,
            require:true,
        },
        email:{
            type:String,
            require:true,
            lowercase:true,
            unique:true
        },
        password:{
            type:String,
            require:true,
        },
        age:Number,
        token:{
            type:String
        }
    },{timeseries:true})

    userSchema.pre('save',function(){
        this.password = bcrypt.hashSync(this.password,8)
    })


    export const userModel = model('user',userSchema) 
