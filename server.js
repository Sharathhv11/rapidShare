import { configDotenv } from "dotenv";

configDotenv({
    path:".env"
})

import database from "./config/database.js"

database();

import app from "./app.js"


const port = process.env.PORT || 3000;



app.listen(port,()=>{
    console.log(`listeing on port ${port}`);
})