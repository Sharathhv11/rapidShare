import express from "express";
import uploadRoute from "./route/uploadRoute.js";
import cronJobs from "./service/cronJobs.js";
import downloadRoute from "./route/downloadRoute.js"
import globalErrorHandler from "./controllers/errorController.js";
import CustomError from "./utilities/customError.js";
import cors from "cors"

cronJobs();

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/upload",uploadRoute);
app.use("/api/download",downloadRoute);

app.use("*",(req,res,next) => next(new CustomError(404,`not found`)));

app.use(globalErrorHandler);

export default app;
