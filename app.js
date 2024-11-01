import express from "express";
import uploadRoute from "./route/uploadRoute.js";
import cronJobs from "./service/cronJobs.js";

cronJobs();

const app = express();

app.use(express.json());

app.use("/api",uploadRoute);

export default app;