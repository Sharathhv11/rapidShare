import mongoose from "mongoose"


export default async function connect(){
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log("db connected successfully")
    } catch (error) {
        console.log("db connection failed :"+error.messge);
    }
}