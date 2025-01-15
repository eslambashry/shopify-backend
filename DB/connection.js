import mongoose from "mongoose";

export const connectionDB = async() => {
 return await mongoose.connect(process.env.MONGOBD_URL)
.then((res)=>{console.log("Connection Done Successfully ✔️".green.bold); 
}).catch((err)=>{console.log("Connection Fail ⚠️".red.bold,err); 
})}


