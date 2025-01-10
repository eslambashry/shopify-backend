import mongoose from "mongoose";

export const connectionDB = async() => {
 return await mongoose.connect('mongodb://localhost:27017/shopify-store')
.then((res)=>{console.log("Connection Done Successfully ✔️"); 
}).catch((err)=>{console.log("Connection Fail ❎",err); 
})}