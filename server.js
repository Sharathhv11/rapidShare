import { configDotenv } from "dotenv";
import app from "./app.js"

configDotenv({
    path:"./config.env"
})

import database from "./config/database.js"

database();


const port = process.env.PORT || 3000;


app.listen(port,()=>{
    console.log(`listeing on port ${port}`);
})