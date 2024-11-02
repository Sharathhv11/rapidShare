import express from "express";
import uploadRoute from "./route/uploadRoute.js";
import cronJobs from "./service/cronJobs.js";
import downloadRoute from "./route/downloadRoute.js"

cronJobs();

const app = express();

app.use(express.json());

app.use("/api/upload",uploadRoute);
app.use("/api/download",downloadRoute);

export default app;