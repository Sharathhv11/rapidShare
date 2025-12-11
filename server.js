import "dotenv/config"

import database from "./config/database.js"
import "./utilities/supabaseKeepAlive.js"

database();

import app from "./app.js"


const port = process.env.PORT || 3000;




app.listen(port,"0.0.0.0")
